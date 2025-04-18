const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({name, email, password, role});
    const token = generateToken(newUser);

    res.status(201).json({token, user: {name: newUser.name, role: newUser.role}});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error});
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    const token = generateToken(user);

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};