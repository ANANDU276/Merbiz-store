const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendOrderConfirmationEmail = require("../utils/sendEmail");
const { validateReturnItems } = require("../utils/orderValidation");

// Constants
const ORDER_STATUSES = [
  "Pending", "Processing", "Shipped", "Delivered", 
  "Cancelled", "Partially Returned", "Returned"
];

const PAYMENT_STATUSES = [
  "Pending", "Paid", "Cash on Delivery", "Failed",
  "Partially Refunded", "Refunded"
];

const RETURN_STATUSES = [
  "Pending", "Approved", "Rejected", "Processing", "Completed"
];

// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    const { email, items, total, ...rest } = req.body;

    if (!email || !items || !total) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    // Add returnedQuantity: 0 to each item
    const orderItems = items.map(item => ({
      ...item,
      returnedQuantity: 0
    }));

    const newOrder = new Order({
      email,
      items: orderItems,
      total,
      ...rest,
      returnRequests: [],
      refunds: []
    });

    await newOrder.save();

    res.status(201).json({ 
      message: "Order placed successfully", 
      order: newOrder 
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail(email, newOrder).catch((err) =>
      console.error("Failed to send confirmation email:", err.message)
    );
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to place order", 
      details: error.message 
    });
  }
});

// GET /api/orders - Get all orders (admin)
router.get("/", async (req, res) => {
  try {
    const { status, sort = '-createdAt', limit } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (req.query.hasReturns === 'true') {
      query['returnRequests.0'] = { $exists: true };
    }

    const orders = await Order.find(query)
      .sort(sort)
      .limit(parseInt(limit) || 0);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch orders", 
      details: err.message 
    });
  }
});

// GET /api/orders/user - Get orders by user email
router.get("/user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const orders = await Order.find({ email })
      .sort('-createdAt')
      .populate('returnRequests.items.productId', 'name image');
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch user orders", 
      details: err.message 
    });
  }
});

// GET /api/orders/:id - Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch order", 
      details: err.message 
    });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ 
      error: "Invalid status value", 
      allowed: ORDER_STATUSES 
    });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ 
      message: "Order status updated", 
      order: updatedOrder 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to update order status", 
      details: err.message 
    });
  }
});

// POST /api/orders/:id/returns - Request a partial return
router.post("/:id/returns", async (req, res) => {
  const { items, reason } = req.body;
  
  if (!items || !reason) {
    return res.status(400).json({ 
      error: "Return items and reason are required" 
    });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Validate return window (30 days)
    const returnDeadline = new Date(order.createdAt);
    returnDeadline.setDate(returnDeadline.getDate() + 30);
    
    if (new Date() > returnDeadline) {
      return res.status(400).json({ 
        error: "Return window has expired" 
      });
    }

    // Validate return items
    const validationError = validateReturnItems(order, items);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Create return request
    const returnRequest = {
      items: items.map(item => ({
        productId: item.productId,
        name: order.items.find(i => i.productId === item.productId).name,
        quantity: item.quantity,
        price: order.items.find(i => i.productId === item.productId).price,
        reason,
        status: "Pending"
      })),
      requestedAt: new Date(),
      status: "Pending"
    };

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { returnRequests: returnRequest },
        $inc: { 
          "items.$[elem].returnedQuantity": items[0].quantity 
        }
      },
      { 
        new: true,
        arrayFilters: [{ "elem.productId": items[0].productId }]
      }
    );

    res.json({ 
      message: "Return request submitted", 
      order: updatedOrder 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to submit return request", 
      details: err.message 
    });
  }
});

// PUT /api/orders/:id/returns/:returnId/status - Process return (admin)
router.put("/:id/returns/:returnId/status", async (req, res) => {
  const { status, adminNotes } = req.body;

  if (!RETURN_STATUSES.includes(status)) {
    return res.status(400).json({ 
      error: "Invalid return status", 
      allowed: RETURN_STATUSES 
    });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const returnRequest = order.returnRequests.id(req.params.returnId);
    if (!returnRequest) {
      return res.status(404).json({ error: "Return request not found" });
    }

    // Update return status
    returnRequest.status = status;
    returnRequest.processedAt = new Date();
    if (adminNotes) returnRequest.adminNotes = adminNotes;

    // Update order status if needed
    if (status === "Approved") {
      const allItemsReturned = order.items.every(item => 
        item.quantity === item.returnedQuantity
      );
      
      order.status = allItemsReturned ? "Returned" : "Partially Returned";
      order.paymentStatus = allItemsReturned ? "Refunded" : "Partially Refunded";
    }

    await order.save();

    res.json({ 
      message: `Return request ${status.toLowerCase()}`, 
      order 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to process return request", 
      details: err.message 
    });
  }
});

// POST /api/orders/:id/refunds - Process refund (admin)
router.post("/:id/refunds", async (req, res) => {
  const { amount, method, transactionId } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          refunds: {
            amount,
            method,
            transactionId,
            processedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({ 
      message: "Refund processed successfully", 
      order: updatedOrder 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to process refund", 
      details: err.message 
    });
  }
});

module.exports = router;
