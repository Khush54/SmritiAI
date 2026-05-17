const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    displayName: { type: String, default: "Anonymous Caregiver" },
    role: { type: String, default: "Family Caregiver" },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
