const express = require("express");
const router = express.Router();
const { getAlerts, markAllRead } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAlerts);
router.put("/mark-read", protect, markAllRead);

module.exports = router;
