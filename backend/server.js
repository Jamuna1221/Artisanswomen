require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const http = require("http");
const { init: initSocket } = require("./config/socket");

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
const authRoutes = require("./routes/auth");
const notificationRoutes = require("./routes/notificationRoutes");
const sellerSettingsRoutes = require("./routes/sellerSettingsRoutes");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get("/", (req, res) => {
  res.send("MarketLink API is running 🚀");
});

// Seller/Auth Routes (from teammate)
app.use("/api/auth", authRoutes);
app.use("/api/seller/settings", sellerSettingsRoutes);

// Admin Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/verifications", verificationRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/complaints", complaintRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/analytics", analyticsRoutes);

// General Notification System
app.use("/api/notifications", notificationRoutes);

// Simulation Routes for Notifications
const simulationController = require("./controllers/simulationController");
app.post("/api/admin/simulate/user-login", simulationController.simulateUserLogin);
app.post("/api/admin/simulate/seller-registration", simulationController.simulateSellerRegistration);
app.post("/api/admin/simulate/new-product", simulationController.simulateNewProduct);
app.post("/api/admin/simulate/new-complaint", simulationController.simulateNewComplaint);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);
io.on("connection", (socket) => {
  console.log("Admin Socket Client Connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Admin Socket Client Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
