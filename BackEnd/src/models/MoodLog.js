const mongoose = require("mongoose");

const moodLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  sleep: {
    type: String,
    required: true
  },
  appetite: {
    type: String,
    required: true
  }
}, { timestamps: true });

moodLogSchema.index({ patientId: 1, date: -1 });

module.exports = mongoose.model("MoodLog", moodLogSchema);
