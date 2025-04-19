const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const postRoutes = require("./routes/authRoutes");
const letterRoutes = require("./routes/letterRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", postRoutes);
app.use("/", letterRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
