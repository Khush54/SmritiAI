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
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  assignedDoctorName: String,
  assignedDoctorSpecialty: String,
  assignedDoctorLocation: String,
  doctorRecommendationReason: String,
  doctorReferralStatus: {
    type: String,
    enum: ["none", "recommended", "assigned", "completed"],
    default: "none"
  },
  doctorAssignedAt: Date,
  followUpDate: String,
  clinicalNotes: [{
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    noteType: String,
    observation: String,
    recommendations: String,
    sharedWithCaregiver: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  profilePhoto: String,
  gender: String,
  phone: String,
  city: String,
  
  score: {
    type: Number,
    default: null
  },
  risk: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    default: "Low"
  },
  trend: {
    type: String,
    default: null
  },
  mood: {
    type: String,
    default: null
  },
  sleep: {
    type: String,
    default: null
  },
  appetite: {
    type: String,
    default: null
  },
  lastTestDate: {
    type: String, 
    default: null
  },
  lastLogDate: {
    type: String, 
    default: null
  },
  recommendations: [{
    icon: String,
    color: String,
    priority: String,
    text: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
