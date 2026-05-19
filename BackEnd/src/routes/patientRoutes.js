const express = require("express");
const router = express.Router();
const { addPatient, getPatients, updatePatient, getDoctorPatients, getDoctorDashboard, addClinicalNote } = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");

router.get("/doctor/dashboard", protect, getDoctorDashboard);
router.get("/doctor/assigned", protect, getDoctorPatients);

router.route("/")
  .post(protect, addPatient)
  .get(protect, getPatients);

router.route("/:id")
  .put(protect, updatePatient);

router.post("/:id/clinical-notes", protect, addClinicalNote);

module.exports = router;
