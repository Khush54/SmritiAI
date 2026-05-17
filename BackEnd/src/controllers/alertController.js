const Alert = require("../models/Alert");

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Alert.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All alerts marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAlert = async (userId, alertData) => {
  try {
    return await Alert.create({ userId, ...alertData });
  } catch (error) {
    console.error("Failed to create alert:", error);
  }
};
