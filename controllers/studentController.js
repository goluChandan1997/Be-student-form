const Student = require("../models/Student");
const path = require("path");
const fs = require("fs");

// Create a new student
const createStudent = async (req, res) => {
  try {
    const {
      name,
      fathersName,
      email,
      mobile,
      age,
      studyDurationYears,
      studyDurationMonths,
      feedback,
      address,
    } = req.body;

    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      // If file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Student with this email already exists" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Picture is required" });
    }

    // Create picture URL
    const pictureUrl = `/uploads/${req.file.filename}`;

    // Create student
    const student = new Student({
      name,
      fathersName,
      email,
      mobile,
      age: parseInt(age),
      studyDurationYears: parseInt(studyDurationYears),
      studyDurationMonths: parseInt(studyDurationMonths),
      picture: pictureUrl,
      feedback,
      address,
    });

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    // If file was uploaded, delete it on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Student with this email already exists" });
    }

    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all students (admin only)
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    res.json({
      students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get student by ID (admin only)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search students (admin only)
const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const students = await Student.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
        { fathersName: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete student (admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete associated picture file
    if (student.picture) {
      const picturePath = path.join(__dirname, "../", student.picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  searchStudents,
  deleteStudent,
};
