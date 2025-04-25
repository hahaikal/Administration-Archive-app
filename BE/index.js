const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const letterRoutes = require("./routes/letterRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", authRoutes);
app.use("/", letterRoutes);
app.use("/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "../FE/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../FE/dist/index.html"));
});

module.exports = app;
