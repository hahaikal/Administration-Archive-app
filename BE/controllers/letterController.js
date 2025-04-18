const Letter = require("../models/Letter");
const extractFromPDF = require("../utils/pdfExtractor");
const path = require("path");

exports.uploadLetter = async (req, res) => {
  try {
    const filePath = req.file.path;

    const { number, title } = await extractFromPDF(filePath);

    const letter = await Letter.create({
      number,
      title,
      tanggal: new Date(),
      jenis: req.body.jenis || "out",
      fileUrl: filePath,
      createdBy: req.user.id,
    });

    res.status(201).json({ msg: "Letter successfully uploaded", letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Letter failed to upload", err });
  }
};
