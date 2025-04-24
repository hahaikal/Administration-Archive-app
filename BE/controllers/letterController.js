const fs = require("fs");
const Letter = require("../models/Letter");
const { extractFromPDF, removeStarsAndSpace, convertToDate } = require("../utils/pdfExtractor");
const path = require("path");

exports.uploadLetter = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { type, category } = req.body;
    const { number, title, date } = await extractFromPDF(filePath, category);

    const letter = await Letter.create({
      number,
      title,
      date: date,
      category,
      type: type || "out",
      fileUrl: filePath,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Letter successfully uploaded", letter });
  } catch (err) {
    console.error(err);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file after error:", unlinkErr);
        }
      });
    }
    res.status(500).json({ message: "Letter failed to upload", err });
  }
};

exports.uploadLetterFromWhatsApp = async (req, res) => {
  try {
    const { judul, nomor, tanggal } = req.body;
    const filePath = req.file.path;

    number = removeStarsAndSpace(nomor);
    title = removeStarsAndSpace(judul);
    date = convertToDate(tanggal);

    const letter = await Letter.create({
      number,
      title,
      date: date,
      category: "Umum",
      type: "out",
      fileUrl: filePath,
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({ message: "Berhasil mengirim file", letter });
  } catch (err) {
    console.error(err);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file after error:", unlinkErr);
        }
      });
    }
    res.status(500).json({ message: "Gagal mengirim", err });
  }
};

exports.getAllLetter = async (req, res) => {
  try {
    const { search, category , type, date } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { nomor: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const data = await Letter.find(filter).sort({ createdAt: -1 })
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Failed to get Letter", err });
  }
};

exports.deleteLetter = async (req, res) => {
  try {
    const letter = await Letter.findByIdAndDelete(req.params.id);
    if (!letter) return res.status(404).json({ message: "Letter not Found" });

    if (letter.fileUrl) {
      fs.unlink(letter.fileUrl, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      });
    }

    res.json({ message: "Letter successfully Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to Delete", err });
  }
};
