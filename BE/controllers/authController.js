const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendMail');

const otpStore = new Map();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, numberPhone } = req.body;
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, otpExpiry, name, password, role, numberPhone });

    sendEmail(email, 'Kode OTP Verifikasi', `Kode OTP kamu: ${otp}`)
      .catch(error => {
        console.error('Error sending email:', error);
      });

    res.json({ message: 'Kode OTP telah dikirim. Silakan verifikasi OTP untuk melanjutkan pendaftaran.' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error', error});
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({ message: 'OTP tidak ditemukan atau sudah kadaluarsa.' });
    }

    if (Date.now() > otpData.otpExpiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP sudah kadaluarsa.' });
    }

    const { name, password, role, otpExpiry, numberPhone} = otpData;
    const otpp = otpData.otp
    
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: 'Kode OTP Salah' , name, otpp, otpExpiry });
    } else if (otpData.otp === otp) {
      const user = new User({ name, email, password, role, phone: numberPhone });
      await user.save();
      otpStore.delete(email);
    }
    
    res.status(201).json({ message: 'Pendaftaran berhasil. Anda dapat login sekarang.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password is Incorrect" });

    const token = generateToken(user);

    res.json({ token, user: { name: user.name, role: user.role, id: user._id } });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};