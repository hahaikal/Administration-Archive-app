const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Akses ditolak, tidak ada token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
