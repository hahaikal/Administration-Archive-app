const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPhoneNumber
} = require("../controllers/userController");

router.get("/users", authMiddleware, getAllUsers);
router.post("/getPhoneNumber", getPhoneNumber);
router.put("/users/:id", authMiddleware, authorizeRoles("admin"), updateUserRole);
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), deleteUser);


module.exports = router;
