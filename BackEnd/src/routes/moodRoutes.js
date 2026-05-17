const express = require("express");
const router = express.Router();
const { addMoodLog, getMoodLogsByPatient } = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addMoodLog);
router.get("/:patientId", protect, getMoodLogsByPatient);

module.exports = router;
