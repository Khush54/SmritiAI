const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { displayName, role, rating, message } = req.body;
    if (!message || !rating) {
      return res.status(400).json({ success: false, message: "Message and rating are required." });
    }
    const feedback = await Feedback.create({ displayName, role, rating, message });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
