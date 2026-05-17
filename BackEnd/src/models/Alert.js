const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },
  patientName: String,
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "critical"],
    default: "info"
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);
