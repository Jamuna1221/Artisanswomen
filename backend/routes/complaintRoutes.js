const express = require("express");
const {
  getComplaints,
  getComplaintById,
  respondToComplaint,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getComplaints);
router.get("/:id", protect, getComplaintById);
router.post("/:id/reply", protect, respondToComplaint);
router.put("/:id/status", protect, updateComplaintStatus);

module.exports = router;
