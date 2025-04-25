const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true
  },
  title: String,
  date: Date,
  category: String,
  type: { 
    type: String, 
    enum: ["in", "out"]
  },
  fileUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Letter" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Letter", letterSchema);
