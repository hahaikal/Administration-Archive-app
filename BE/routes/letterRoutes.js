const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadLetter } = require("../controllers/letterController");
const { authMiddleware } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), uploadLetter);

module.exports = router;
