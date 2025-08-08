const mongoose = require("mongoose");

const returnItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Processing", "Refunded"],
    default: "Pending"
  },
  processedAt: Date,
  refundAmount: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    returnedQuantity: {
      type: Number,
      default: 0
    }
  }],
  email: {
    type: String,
    required: true
  },
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    apartment: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Partially Returned", "Returned"],
    default: "Pending"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Cash on Delivery", "Failed", "Partially Refunded", "Refunded"],
    default: "Pending"
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  returnRequests: [{
    items: [returnItemSchema],
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Processing", "Completed"],
      default: "Pending"
    },
    adminNotes: String
  }],
  refunds: [{
    amount: Number,
    method: String,
    processedAt: Date,
    transactionId: String
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
orderSchema.index({ email: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "returnRequests.status": 1 });

// Virtual for checking if order has any returns
orderSchema.virtual('hasReturns').get(function() {
  return this.returnRequests && this.returnRequests.length > 0;
});

// Method to calculate total returned amount
orderSchema.methods.getTotalReturnedAmount = function() {
  if (!this.returnRequests) return 0;
  
  return this.returnRequests.reduce((total, request) => {
    if (request.status === 'Approved' || request.status === 'Completed') {
      return total + request.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    }
    return total;
  }, 0);
};

module.exports = mongoose.model("Order", orderSchema);
