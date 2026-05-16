const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  location: String,
  doctor: String,
  notes: String,
  
  // Health Metrics Default Values
  score: {
    type: Number,
    default: 100
  },
  risk: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    default: "Low"
  },
  trend: {
    type: String,
    default: "stable"
  },
  mood: {
    type: String,
    default: "Neutral"
  },
  sleep: {
    type: String,
    default: "Normal"
  },
  appetite: {
    type: String,
    default: "Normal"
  }
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
