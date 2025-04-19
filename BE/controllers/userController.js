const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to retrieve data ", err });
  }
};

exports.updateUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
  
      if (!["admin", "guru", "kepala sekolah"].includes(role)) {
        return res.status(400).json({ msg: "Invalid Role" });
      }
  
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
  
      if (!user) return res.status(404).json({ msg: "User not Found" });
  
      res.json({ msg: "User role successfully updated", user });
    } catch (err) {
      res.status(500).json({ msg: "Failed to Update Role", err });
    }
};

exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ msg: "User not Found" });
  
      res.json({ msg: "Succesfully deleted user" });
    } catch (err) {
      res.status(500).json({ msg: "Failed to delete user", err });
    }
};
  