const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    fathersName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
      maxlength: [100, "Father's name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid mobile number"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [100, "Age cannot exceed 100"],
    },
    studyDurationYears: {
      type: Number,
      required: [true, "Study duration years is required"],
      min: [0, "Years cannot be negative"],
      max: [20, "Years cannot exceed 20"],
    },
    studyDurationMonths: {
      type: Number,
      required: [true, "Study duration months is required"],
      min: [0, "Months cannot be negative"],
      max: [11, "Months cannot exceed 11"],
    },
    picture: {
      type: String,
      required: [true, "Picture is required"],
    },
    feedback: {
      type: String,
      required: [true, "Feedback is required"],
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ mobile: 1 });
studentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Student", studentSchema);
