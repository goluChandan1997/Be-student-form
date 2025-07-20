const Student = require("../models/Student");

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
      // !email ||
      !mobile ||
      !age ||
      !studyStartDate ||
      !studyEndDate ||
      !feedback ||
      !address
    ) {
      console.log("Missing required fields");
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
      return res.status(400).json({ error: "Age must be between 1 and 100" });
    }

    // Validate and parse dates
    const startDate = new Date(studyStartDate);
    const endDate = new Date(studyEndDate);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Invalid study start date" });
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid study end date" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        error: "Study end date must be after start date",
      });
    }

    // Validate email format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Please enter a valid email address" });
    // }

    // Validate mobile number format (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ""))) {
      return res
        .status(400)
        .json({ error: "Mobile number should be 10 digits" });
    }

    // Convert image buffer to base64 (with memory storage, req.file.buffer contains the file data)
    const pictureBase64 = req.file.buffer.toString("base64");
    const pictureMimeType = req.file.mimetype;

    console.log("Creating student with data:", {
      name,
      fathersName,
      email,
      mobile,
      age: ageNum,
      studyStartDate: startDate,
      studyEndDate: endDate,
      pictureSize: req.file.buffer.length,
      pictureMimeType,
      feedback,
      address,
    });

    // Create student with base64 image data
    const student = new Student({
      name,
      fathersName,
      email,
      mobile,
      age: ageNum,
      studyStartDate: startDate,
      studyEndDate: endDate,
      picture: pictureBase64,
      pictureMimeType: pictureMimeType,
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
    // const includePicture = req.query.includePicture === "true";

    // // Select fields based on whether pictures are needed
    // let selectFields = includePicture ? {} : { picture: 0 };

    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    // If pictures are requested, convert base64 to data URLs for easier frontend usage
    // const studentsWithImages = includePicture
    //   ? students.map((student) => {
    //       const studentObj = student.toObject();
    //       if (studentObj.picture && studentObj.pictureMimeType) {
    //         studentObj.pictureDataUrl = `data:${studentObj.pictureMimeType};base64,${studentObj.picture}`;
    //       }
    //       return studentObj;
    //     })
    //   : students;

    res.json({
      students: students,
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
    const includePicture = req.query.includePicture === "true";
    let selectFields = includePicture ? {} : { picture: 0 };

    const student = await Student.findById(req.params.id, selectFields);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Convert base64 to data URL if picture is requested
    const studentObj = student.toObject();
    if (includePicture && studentObj.picture && studentObj.pictureMimeType) {
      studentObj.pictureDataUrl = `data:${studentObj.pictureMimeType};base64,${studentObj.picture}`;
    }

    res.json(studentObj);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get student image by ID
const getStudentImage = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select(
      "picture pictureMimeType"
    );

    if (!student || !student.picture) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Convert base64 back to buffer
    const imageBuffer = Buffer.from(student.picture, "base64");

    // Set proper headers
    res.set({
      "Content-Type": student.pictureMimeType || "image/jpeg",
      "Content-Length": imageBuffer.length,
      "Cache-Control": "public, max-age=86400", // Cache for 1 day
    });

    res.send(imageBuffer);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    console.error("Error serving image:", error);
    res.status(500).json({ error: "Error serving image" });
  }
};

// Search students (admin only)
const searchStudents = async (req, res) => {
  try {
    const { q, startDate, endDate } = req.query;
    const includePicture = req.query.includePicture === "true";

    if (!q && !startDate && !endDate) {
      return res.status(400).json({ error: "Search parameters are required" });
    }

    let query = {};
    let selectFields = includePicture ? {} : { picture: 0 };

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

    const students = await Student.find(query, selectFields).sort({
      createdAt: -1,
    });

    // Convert base64 to data URLs if pictures are requested
    const studentsWithImages = includePicture
      ? students.map((student) => {
          const studentObj = student.toObject();
          if (studentObj.picture && studentObj.pictureMimeType) {
            studentObj.pictureDataUrl = `data:${studentObj.pictureMimeType};base64,${studentObj.picture}`;
          }
          return studentObj;
        })
      : students;

    res.json(studentsWithImages);
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

    // With base64 storage, no need to delete physical files
    // The image data will be deleted along with the document
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully",
      deletedStudent: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
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
    const includePicture = req.query.includePicture === "true";

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

    let selectFields = includePicture ? {} : { picture: 0 };

    const students = await Student.find(
      {
        $or: [
          { studyStartDate: { $gte: start, $lte: end } },
          { studyEndDate: { $gte: start, $lte: end } },
          {
            studyStartDate: { $lte: start },
            studyEndDate: { $gte: end },
          },
        ],
      },
      selectFields
    ).sort({ studyStartDate: 1 });

    // Convert base64 to data URLs if pictures are requested
    const studentsWithImages = includePicture
      ? students.map((student) => {
          const studentObj = student.toObject();
          if (studentObj.picture && studentObj.pictureMimeType) {
            studentObj.pictureDataUrl = `data:${studentObj.pictureMimeType};base64,${studentObj.picture}`;
          }
          return studentObj;
        })
      : students;

    res.json({
      students: studentsWithImages,
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

// Update student (admin only)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
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

    // Find existing student
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== existingStudent.email) {
      const emailExists = await Student.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res
          .status(400)
          .json({ error: "Student with this email already exists" });
      }
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (fathersName) updateData.fathersName = fathersName;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (age) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
        return res.status(400).json({ error: "Age must be between 1 and 100" });
      }
      updateData.age = ageNum;
    }
    if (studyStartDate) {
      const startDate = new Date(studyStartDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: "Invalid study start date" });
      }
      updateData.studyStartDate = startDate;
    }
    if (studyEndDate) {
      const endDate = new Date(studyEndDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid study end date" });
      }
      updateData.studyEndDate = endDate;
    }
    if (feedback) updateData.feedback = feedback;
    if (address) updateData.address = address;

    // Handle image update if new file is uploaded
    if (req.file) {
      updateData.picture = req.file.buffer.toString("base64");
      updateData.pictureMimeType = req.file.mimetype;
    }

    // Validate date relationship
    const finalStartDate =
      updateData.studyStartDate || existingStudent.studyStartDate;
    const finalEndDate =
      updateData.studyEndDate || existingStudent.studyEndDate;

    if (finalStartDate >= finalEndDate) {
      return res.status(400).json({
        error: "Study end date must be after start date",
      });
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Student updated successfully",
      student: {
        id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        studyDuration: updatedStudent.studyDuration,
        updatedAt: updatedStudent.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID" });
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

    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentImage,
  searchStudents,
  deleteStudent,
  getStudentsByDateRange,
  updateStudent,
};
