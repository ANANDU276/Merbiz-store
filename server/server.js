const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const addressRoutes = require("./routes/address");

dotenv.config();
const app = express();

// ✅ CORS Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://merbiz-store.vercel.app",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight
  }
  next();
});

app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // includes /me
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/addresses", addressRoutes);

// ✅ Start Server
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
