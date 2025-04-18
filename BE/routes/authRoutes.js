const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ msg: `Halo, user ${req.user.id} dengan role ${req.user.role}` });
});

module.exports = router;
