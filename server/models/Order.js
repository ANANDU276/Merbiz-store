const mongoose = require("mongoose");

// Schema for each item in the order
const itemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },

  // Per-item return request fields
  returnRequest: {
    requested: { type: Boolean, default: false },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Processing"],
      default: "Pending",
    },
    requestedAt: { type: Date },
  },
});

// Main order schema
const orderSchema = new mongoose.Schema({
  items: [itemSchema], // Array of items with individual return request info

  email: { type: String, required: true },

  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
  },

  paymentMethod: { type: String },
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["Order Placed", "Shipped", "Reached Nearby", "Delivered", "Returned"],
    default: "Order Placed",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Cash on Delivery", "Failed"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
