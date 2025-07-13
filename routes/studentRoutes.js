const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { authenticateAdmin } = require("../middleware/auth");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  searchStudents,
  deleteStudent,
} = require("../controllers/studentController");

// Public routes
router.post("/", upload.single("picture"), createStudent);

// Protected routes (admin only)
router.get("/", authenticateAdmin, getAllStudents);
router.get("/search", authenticateAdmin, searchStudents);
router.get("/:id", authenticateAdmin, getStudentById);
router.delete("/:id", authenticateAdmin, deleteStudent);

module.exports = router;
