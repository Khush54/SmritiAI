const express = require("express");
const router = express.Router();
const { addAssessment, getAssessmentsByPatient } = require("../controllers/screeningController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, addAssessment);

router.route("/:patientId")
  .get(protect, getAssessmentsByPatient);

module.exports = router;
