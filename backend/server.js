require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const http = require("http");
const { init: initSocket } = require("./config/socket");

const authRoutes = require("./routes/auth");
const buyerRoutes = require("./routes/buyerRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const sellerProductRoutes = require("./routes/sellerProductRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const sellerSettingsRoutes = require("./routes/sellerSettingsRoutes");
const communityChatRoutes = require("./routes/communityChatRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// CORS Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS for all routes (Express v5 compatible wildcard)
app.options("/*splat", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("ArtisansWomen API is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller/settings", sellerSettingsRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/community", communityChatRoutes);

// Seller Dashboard Routes
app.use("/api/seller/products", sellerProductRoutes);

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

// Error Handling Middleware (must be LAST)
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);
io.on("connection", (socket) => {
  console.log("Socket Client Connected:", socket.id);
  
  // Custom event for forums/community
  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });
  
  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
    console.log(`User left group: ${groupId}`);
  });

  socket.on('typing', ({ groupId, userName }) => {
    socket.to(groupId).emit('display_typing', { groupId, userName });
  });

  socket.on('stop_typing', ({ groupId, userName }) => {
    socket.to(groupId).emit('hide_typing', { groupId, userName });
  });

  socket.on("disconnect", () => {
    console.log("Socket Client Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
