const express = require("express");
const router = express.Router();
const { addPatient, getPatients, updatePatient } = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, addPatient)
  .get(protect, getPatients);

router.route("/:id")
  .put(protect, updatePatient);

module.exports = router;
