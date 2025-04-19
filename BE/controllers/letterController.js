const fs = require("fs");
const Letter = require("../models/Letter");
const extractFromPDF = require("../utils/pdfExtractor");
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

    res.status(201).json({ msg: "Letter successfully uploaded", letter });
  } catch (err) {
    console.error(err);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file after error:", unlinkErr);
        }
      });
    }
    res.status(500).json({ msg: "Letter failed to upload", err });
  }
};

exports.getAllLetter = async (req, res) => {
  try {
    const { search, category , type } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { nomor: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const letter = await Letter.find(filter).sort({ createdAt: -1 });
    res.json(letter);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get Letter", err });
  }
};

exports.deleteLetter = async (req, res) => {
  try {
    const letter = await Letter.findByIdAndDelete(req.params.id);
    if (!letter) return res.status(404).json({ msg: "Letter not Found" });

    if (letter.fileUrl) {
      fs.unlink(letter.fileUrl, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      });
    }

    res.json({ msg: "Letter successfully Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to Delete", err });
  }
};
