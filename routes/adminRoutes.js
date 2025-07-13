const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/auth");
const {
  login,
  getProfile,
  changePassword,
  createAdmin,
} = require("../controllers/adminController");
const { getAllStudents } = require("../controllers/studentController");

// Public routes
router.post("/login", login);
router.post("/create", createAdmin); // For initial setup - should be protected in production

// Protected routes
router.get("/profile", authenticateAdmin, getProfile);
router.put("/change-password", authenticateAdmin, changePassword);
router.get("/students", authenticateAdmin, getAllStudents);

module.exports = router;
