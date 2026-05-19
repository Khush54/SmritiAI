const express = require("express");
const router = express.Router();

const {
  saveUser,
  loginUser,
  updateProfile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/save-user",
  saveUser
);

router.post(
  "/login",
  loginUser
);

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;
