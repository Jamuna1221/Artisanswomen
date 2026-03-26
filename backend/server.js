require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route Imports
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("MarketLink Admin API is running 🚀");
});

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/verifications", verificationRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/complaints", complaintRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/analytics", analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});