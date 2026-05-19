const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true
  },

  fullName: String,
  email: String,
  phone: String,
  specialization: String,
  license: String,
  clinic: String,
  location: String,
  city: String,
  preferredLanguage: String,

  role: {
    type: String,
    enum: ["user", "doctor"],
    required: true
  },

  authProvider: {
    type: String,
    enum: ["google", "email", "phone"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
