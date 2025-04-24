const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  uploadLetter,
  uploadLetterFromWhatsApp,
  getAllLetter,
  deleteLetter,
} = require("../controllers/letterController");

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
router.post("/botwa/uploadFromWhatsApp", upload.single("file"), uploadLetterFromWhatsApp);
router.get("/getAllDoc", authMiddleware, getAllLetter);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteLetter);

module.exports = router;
