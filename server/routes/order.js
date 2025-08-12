const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendOrderConfirmationEmail = require("../utils/sendEmail");

// Constants
const ALLOWED_STATUSES = [
  "Order Placed",
  "Shipped",
  "Reached Nearby",
  "Delivered",
  "Returned",
];
const ALLOWED_RETURN_ACTIONS = [
  "Pending",
  "Approved",
  "Rejected",
  "Processing",
];

// Utils
const isValidStatus = (status) => ALLOWED_STATUSES.includes(status);
const isValidReturnAction = (action) => ALLOWED_RETURN_ACTIONS.includes(action);

/**
 * POST /api/orders
 * Create a new order
 */
router.post("/", async (req, res) => {
  try {
    const { email, items, total, ...rest } = req.body;

    if (!email || !items || !total) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const newOrder = new Order({ email, items, total, ...rest });
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail(email, newOrder).catch((err) =>
      console.error("Failed to send confirmation email:", err.message)
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to place order",
      details: error.message,
    });
  }
});

/**
 * GET /api/orders
 * Get all orders (admin)
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch orders",
      details: err.message,
    });
  }
});

/**
 * GET /api/orders/user?email=...
 * Get orders by user email
 */
router.get("/user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user orders",
      details: err.message,
    });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status
 */
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidStatus(status)) {
    return res.status(400).json({
      error: "Invalid status value",
      allowed: ALLOWED_STATUSES,
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

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update order status",
      details: err.message,
    });
  }
});

/**
 * PUT /api/orders/:orderId/items/:itemId/return
 * Request a return for a specific item in an order
 */
router.put("/:orderId/items/:itemId/return", async (req, res) => {
  const { orderId, itemId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: "Return reason is required" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in this order" });
    }

    // Check if return is already requested for this item
    if (item.returnRequest?.requested) {
      return res
        .status(400)
        .json({ error: "Return already requested for this item" });
    }

    // Return eligibility check (30 days)
    const returnWindowDays = 30;
    const orderDate = new Date(order.createdAt);
    const returnDeadline = new Date(
      orderDate.setDate(orderDate.getDate() + returnWindowDays)
    );
    if (new Date() > returnDeadline) {
      return res.status(400).json({ error: "Return window has expired" });
    }

    // Update item return request
    item.returnRequest = {
      requested: true,
      reason,
      status: "Pending",
      requestedAt: new Date(),
    };

    await order.save();

    res.json({ message: "Return request submitted for item", order });
  } catch (err) {
    res.status(500).json({
      error: "Failed to submit return request",
      details: err.message,
    });
  }
});

/**
 * PUT /api/orders/:orderId/items/:itemId/return/status
 * Admin updates return status for a specific item
 */
router.put("/:orderId/items/:itemId/return/status", async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  if (!isValidReturnAction(status)) {
    return res.status(400).json({
      error: "Invalid return status",
      allowed: ALLOWED_RETURN_ACTIONS,
    });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in this order" });
    }

    if (!item.returnRequest?.requested) {
      return res
        .status(400)
        .json({ error: "No return request for this item" });
    }

    // Update status
    item.returnRequest.status = status;
    item.returnRequest.processedAt = new Date();

    // If approved, optionally mark item as returned
    if (status === "Approved") {
      // You can also update order.status if ALL items are returned
      item.returned = true; // optional extra flag
    }

    await order.save();

    res.json({
      message: `Return request for item ${status.toLowerCase()} successfully`,
      order,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update return status",
      details: err.message,
    });
  }
});

module.exports = router;
