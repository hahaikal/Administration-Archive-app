const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve data ", err });
  }
};

exports.updateUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, password, numberPhone } = req.body;
  
      if (!["admin", "guru", "kepala sekolah"].includes(role)) {
        return res.status(400).json({ message: "Invalid Role" });
      }
  
      const updateData = { name, email, role, phone: numberPhone };
      if (password) {
        updateData.password = password;
      }

      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!user) return res.status(404).json({ message: "User not Found" });
  
      res.json({ message: "User role successfully updated", user });
    } catch (err) {
      res.status(500).json({ message: "Failed to Update Role", err });
    }
};

exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: "User not Found" });
  
      res.json({ message: "Succesfully deleted user" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete user", err });
    }
};
  