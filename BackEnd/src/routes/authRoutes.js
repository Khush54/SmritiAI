const express = require("express");
const router = express.Router();

const {
  saveUser,
  loginUser
} = require("../controllers/authController");

router.post(
  "/save-user",
  saveUser
);

router.post(
  "/login",
  loginUser
);

module.exports = router;