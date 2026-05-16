const express = require("express");
const router = express.Router();
const { addPatient, getPatients } = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, addPatient)
  .get(protect, getPatients);

module.exports = router;
