const Complaint = require("../models/Complaint");
const { createAdminNotification } = require("../utils/notificationHelper");

const getComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("userId", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const respondToComplaint = async (req, res) => {
  try {
    const { adminReply, status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { adminReply, status: status || "In Progress", repliedAt: new Date() },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Notify admin 
    await createAdminNotification("Complaint", `Complaint response sent by admin`, {
      complaintId: complaint._id
    });

    res.json({ message: "Reply sent", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: `Status updated to ${status}`, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComplaints, getComplaintById, respondToComplaint, updateComplaintStatus };
