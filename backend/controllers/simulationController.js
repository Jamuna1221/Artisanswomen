const { createAdminNotification } = require("../utils/notificationHelper");

// Simulation Controller to demonstrate notifications
exports.simulateUserLogin = async (req, res) => {
  const { name } = req.body;
  await createAdminNotification("User", `User ${name || 'Deepak'} logged in successfully`, {
    device: "Chrome on Windows",
    time: new Date()
  });
  res.json({ message: "User login simulation triggered" });
};

exports.simulateSellerRegistration = async (req, res) => {
  const { sellerName } = req.body;
  await createAdminNotification("Seller", `New seller/artisan registration: ${sellerName || 'Shanthi Arts'}`, {
    status: "Pending Approval"
  });
  res.json({ message: "Seller registration simulation triggered" });
};

exports.simulateNewProduct = async (req, res) => {
  const { productName, artisanName } = req.body;
  await createAdminNotification("Product", `New product "${productName}" uploaded by ${artisanName}`, {
    category: "Handicrafts"
  });
  res.json({ message: "New product simulation triggered" });
};

exports.simulateNewComplaint = async (req, res) => {
  const { complaintType, userName } = req.body;
  await createAdminNotification("Complaint", `New complaint regarding ${complaintType} from ${userName}`, {
    priority: "High"
  });
  res.json({ message: "New complaint simulation triggered" });
};
