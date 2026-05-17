const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    default: "Low"
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Will store dynamic JSON object representing answers
    default: {}
  }
}, { timestamps: true });

assessmentSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model("Assessment", assessmentSchema);
