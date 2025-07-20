// // const Student = require("../models/Student");
// // const path = require("path");
// // const fs = require("fs");

// // // Create a new student
// // const createStudent = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       fathersName,
// //       email,
// //       mobile,
// //       age,
// //       studyDurationYears,
// //       studyDurationMonths,
// //       feedback,
// //       address,
// //     } = req.body;

// //     // Check if student with email already exists
// //     const existingStudent = await Student.findOne({ email });
// //     if (existingStudent) {
// //       // If file was uploaded, delete it
// //       if (req.file) {
// //         fs.unlinkSync(req.file.path);
// //       }
// //       return res
// //         .status(400)
// //         .json({ error: "Student with this email already exists" });
// //     }

// //     // Check if file was uploaded
// //     if (!req.file) {
// //       return res.status(400).json({ error: "Picture is required" });
// //     }

// //     // Create picture URL
// //     const pictureUrl = `/uploads/${req.file.filename}`;

// //     // Create student
// //     const student = new Student({
// //       name,
// //       fathersName,
// //       email,
// //       mobile,
// //       age: parseInt(age),
// //       studyDurationYears: parseInt(studyDurationYears),
// //       studyDurationMonths: parseInt(studyDurationMonths),
// //       picture: pictureUrl,
// //       feedback,
// //       address,
// //     });

// //     await student.save();

// //     res.status(201).json({
// //       message: "Student registered successfully",
// //       student: {
// //         id: student._id,
// //         name: student.name,
// //         email: student.email,
// //         createdAt: student.createdAt,
// //       },
// //     });
// //   } catch (error) {
// //     // If file was uploaded, delete it on error
// //     if (req.file) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     if (error.name === "ValidationError") {
// //       const errors = Object.values(error.errors).map((err) => err.message);
// //       return res
// //         .status(400)
// //         .json({ error: "Validation failed", details: errors });
// //     }

// //     if (error.code === 11000) {
// //       return res
// //         .status(400)
// //         .json({ error: "Student with this email already exists" });
// //     }

// //     console.error("Error creating student:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // Get all students (admin only)
// // const getAllStudents = async (req, res) => {
// //   try {
// //     const page = parseInt(req.query.page) || 1;
// //     const limit = parseInt(req.query.limit) || 10;
// //     const skip = (page - 1) * limit;

// //     const students = await Student.find()
// //       .sort({ createdAt: -1 })
// //       .skip(skip)
// //       .limit(limit);

// //     const total = await Student.countDocuments();

// //     res.json({
// //       students,
// //       pagination: {
// //         currentPage: page,
// //         totalPages: Math.ceil(total / limit),
// //         totalStudents: total,
// //         hasNext: page < Math.ceil(total / limit),
// //         hasPrev: page > 1,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching students:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // Get student by ID (admin only)
// // const getStudentById = async (req, res) => {
// //   try {
// //     const student = await Student.findById(req.params.id);

// //     if (!student) {
// //       return res.status(404).json({ error: "Student not found" });
// //     }

// //     res.json(student);
// //   } catch (error) {
// //     if (error.name === "CastError") {
// //       return res.status(400).json({ error: "Invalid student ID" });
// //     }

// //     console.error("Error fetching student:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // Search students (admin only)
// // const searchStudents = async (req, res) => {
// //   try {
// //     const { q } = req.query;

// //     if (!q) {
// //       return res.status(400).json({ error: "Search query is required" });
// //     }

// //     const students = await Student.find({
// //       $or: [
// //         { name: { $regex: q, $options: "i" } },
// //         { email: { $regex: q, $options: "i" } },
// //         { mobile: { $regex: q, $options: "i" } },
// //         { fathersName: { $regex: q, $options: "i" } },
// //       ],
// //     }).sort({ createdAt: -1 });

// //     res.json(students);
// //   } catch (error) {
// //     console.error("Error searching students:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // Delete student (admin only)
// // const deleteStudent = async (req, res) => {
// //   try {
// //     const student = await Student.findById(req.params.id);

// //     if (!student) {
// //       return res.status(404).json({ error: "Student not found" });
// //     }

// //     // Delete associated picture file
// //     if (student.picture) {
// //       const picturePath = path.join(__dirname, "../", student.picture);
// //       if (fs.existsSync(picturePath)) {
// //         fs.unlinkSync(picturePath);
// //       }
// //     }

// //     await Student.findByIdAndDelete(req.params.id);

// //     res.json({ message: "Student deleted successfully" });
// //   } catch (error) {
// //     if (error.name === "CastError") {
// //       return res.status(400).json({ error: "Invalid student ID" });
// //     }

// //     console.error("Error deleting student:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // module.exports = {
// //   createStudent,
// //   getAllStudents,
// //   getStudentById,
// //   searchStudents,
// //   deleteStudent,
// // };

// const Student = require("../models/Student");
// const path = require("path");
// const fs = require("fs");

// // Create a new student
// const createStudent = async (req, res) => {
//   try {
//     console.log("=== Student Creation Debug ===");
//     console.log("Request body:", req.body);
//     console.log("Request file:", req.file);

//     const {
//       name,
//       fathersName,
//       email,
//       mobile,
//       age,
//       studyDurationYears,
//       studyDurationMonths,
//       feedback,
//       address,
//     } = req.body;

//     // Validate required fields
//     if (
//       !name ||
//       !fathersName ||
//       !email ||
//       !mobile ||
//       !age ||
//       !studyDurationYears ||
//       !studyDurationMonths ||
//       !feedback ||
//       !address
//     ) {
//       console.log("Missing required fields");
//       console.log("Missing fields check:", {
//         name: !!name,
//         fathersName: !!fathersName,
//         email: !!email,
//         mobile: !!mobile,
//         age: !!age,
//         studyDurationYears: !!studyDurationYears,
//         studyDurationMonths: !!studyDurationMonths,
//         feedback: !!feedback,
//         address: !!address,
//       });

//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(400).json({
//         error: "All fields are required",
//         missingFields: {
//           name: !name,
//           fathersName: !fathersName,
//           email: !email,
//           mobile: !mobile,
//           age: !age,
//           studyDurationYears: !studyDurationYears,
//           studyDurationMonths: !studyDurationMonths,
//           feedback: !feedback,
//           address: !address,
//         },
//       });
//     }

//     // Check if student with email already exists
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       console.log("Student with email already exists:", email);
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res
//         .status(400)
//         .json({ error: "Student with this email already exists" });
//     }

//     // Check if file was uploaded
//     if (!req.file) {
//       console.log("No file uploaded");
//       return res.status(400).json({ error: "Picture is required" });
//     }

//     // Validate age and duration values
//     const ageNum = parseInt(age);
//     const yearsNum = parseInt(studyDurationYears);
//     const monthsNum = parseInt(studyDurationMonths);

//     if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(400).json({ error: "Age must be between 1 and 100" });
//     }

//     if (isNaN(yearsNum) || yearsNum < 0) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res
//         .status(400)
//         .json({ error: "Study duration years must be a valid number" });
//     }

//     if (isNaN(monthsNum) || monthsNum < 0 || monthsNum > 11) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res
//         .status(400)
//         .json({ error: "Study duration months must be between 0 and 11" });
//     }

//     // Create picture URL
//     const pictureUrl = `/uploads/${req.file.filename}`;

//     console.log("Creating student with data:", {
//       name,
//       fathersName,
//       email,
//       mobile,
//       age: ageNum,
//       studyDurationYears: yearsNum,
//       studyDurationMonths: monthsNum,
//       picture: pictureUrl,
//       feedback,
//       address,
//     });

//     // Create student
//     const student = new Student({
//       name,
//       fathersName,
//       email,
//       mobile,
//       age: ageNum,
//       studyDurationYears: yearsNum,
//       studyDurationMonths: monthsNum,
//       picture: pictureUrl,
//       feedback,
//       address,
//     });

//     await student.save();
//     console.log("Student created successfully:", student._id);

//     res.status(201).json({
//       message: "Student registered successfully",
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         createdAt: student.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("=== Error creating student ===");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Full error:", error);

//     // If file was uploaded, delete it on error
//     if (req.file) {
//       try {
//         fs.unlinkSync(req.file.path);
//       } catch (deleteError) {
//         console.error("Error deleting uploaded file:", deleteError);
//       }
//     }

//     if (error.name === "ValidationError") {
//       const errors = Object.values(error.errors).map((err) => err.message);
//       console.log("Validation errors:", errors);
//       return res
//         .status(400)
//         .json({ error: "Validation failed", details: errors });
//     }

//     if (error.code === 11000) {
//       console.log("Duplicate key error:", error.keyValue);
//       return res
//         .status(400)
//         .json({ error: "Student with this email already exists" });
//     }

//     console.error("Unhandled error creating student:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// // Get all students (admin only)
// const getAllStudents = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const students = await Student.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Student.countDocuments();

//     res.json({
//       students,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalStudents: total,
//         hasNext: page < Math.ceil(total / limit),
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Get student by ID (admin only)
// const getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     res.json(student);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ error: "Invalid student ID" });
//     }

//     console.error("Error fetching student:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Search students (admin only)
// const searchStudents = async (req, res) => {
//   try {
//     const { q } = req.query;

//     if (!q) {
//       return res.status(400).json({ error: "Search query is required" });
//     }

//     const students = await Student.find({
//       $or: [
//         { name: { $regex: q, $options: "i" } },
//         { email: { $regex: q, $options: "i" } },
//         { mobile: { $regex: q, $options: "i" } },
//         { fathersName: { $regex: q, $options: "i" } },
//       ],
//     }).sort({ createdAt: -1 });

//     res.json(students);
//   } catch (error) {
//     console.error("Error searching students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Delete student (admin only)
// const deleteStudent = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     // Delete associated picture file
//     if (student.picture) {
//       const picturePath = path.join(__dirname, "../", student.picture);
//       if (fs.existsSync(picturePath)) {
//         fs.unlinkSync(picturePath);
//       }
//     }

//     await Student.findByIdAndDelete(req.params.id);

//     res.json({ message: "Student deleted successfully" });
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ error: "Invalid student ID" });
//     }

//     console.error("Error deleting student:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   createStudent,
//   getAllStudents,
//   getStudentById,
//   searchStudents,
//   deleteStudent,
// };

const Student = require("../models/Student");
const path = require("path");
const fs = require("fs");

// Create a new student
const createStudent = async (req, res) => {
  try {
    console.log("=== Student Creation Debug ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      name,
      fathersName,
      email,
      mobile,
      age,
      studyStartDate,
      studyEndDate,
      feedback,
      address,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !fathersName ||
      !email ||
      !mobile ||
      !age ||
      !studyStartDate ||
      !studyEndDate ||
      !feedback ||
      !address
    ) {
      console.log("Missing required fields");
      console.log("Missing fields check:", {
        name: !!name,
        fathersName: !!fathersName,
        email: !!email,
        mobile: !!mobile,
        age: !!age,
        studyStartDate: !!studyStartDate,
        studyEndDate: !!studyEndDate,
        feedback: !!feedback,
        address: !!address,
      });

      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: "All fields are required",
        missingFields: {
          name: !name,
          fathersName: !fathersName,
          email: !email,
          mobile: !mobile,
          age: !age,
          studyStartDate: !studyStartDate,
          studyEndDate: !studyEndDate,
          feedback: !feedback,
          address: !address,
        },
      });
    }

    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      console.log("Student with email already exists:", email);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Student with this email already exists" });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "Picture is required" });
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Age must be between 1 and 100" });
    }

    // Validate and parse dates
    const startDate = new Date(studyStartDate);
    const endDate = new Date(studyEndDate);

    if (isNaN(startDate.getTime())) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Invalid study start date" });
    }

    if (isNaN(endDate.getTime())) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Invalid study end date" });
    }

    if (startDate >= endDate) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: "Study end date must be after start date",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    // Validate mobile number format (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ""))) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "Mobile number should be 10 digits" });
    }

    // Create picture URL
    const pictureUrl = `/uploads/${req.file.filename}`;

    console.log("Creating student with data:", {
      name,
      fathersName,
      email,
      mobile,
      age: ageNum,
      studyStartDate: startDate,
      studyEndDate: endDate,
      picture: pictureUrl,
      feedback,
      address,
    });

    // Create student
    const student = new Student({
      name,
      fathersName,
      email,
      mobile,
      age: ageNum,
      studyStartDate: startDate,
      studyEndDate: endDate,
      picture: pictureUrl,
      feedback,
      address,
    });

    await student.save();
    console.log("Student created successfully:", student._id);

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        studyDuration: student.studyDuration,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("=== Error creating student ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    // If file was uploaded, delete it on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting uploaded file:", deleteError);
      }
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.log("Validation errors:", errors);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    if (error.code === 11000) {
      console.log("Duplicate key error:", error.keyValue);
      return res
        .status(400)
        .json({ error: "Student with this email already exists" });
    }

    console.error("Unhandled error creating student:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
    const { q, startDate, endDate } = req.query;

    if (!q && !startDate && !endDate) {
      return res.status(400).json({ error: "Search parameters are required" });
    }

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
        { fathersName: { $regex: q, $options: "i" } },
      ];
    }

    // Date range search
    if (startDate || endDate) {
      query.studyStartDate = {};
      if (startDate) {
        query.studyStartDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.studyStartDate.$lte = new Date(endDate);
      }
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

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

// Get students by date range (admin only)
const getStudentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Both start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({
        error: "End date must be after start date",
      });
    }

    const students = await Student.find({
      $or: [
        { studyStartDate: { $gte: start, $lte: end } },
        { studyEndDate: { $gte: start, $lte: end } },
        {
          studyStartDate: { $lte: start },
          studyEndDate: { $gte: end },
        },
      ],
    }).sort({ studyStartDate: 1 });

    res.json({
      students,
      dateRange: {
        startDate: start,
        endDate: end,
        count: students.length,
      },
    });
  } catch (error) {
    console.error("Error fetching students by date range:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  searchStudents,
  deleteStudent,
  getStudentsByDateRange,
};
