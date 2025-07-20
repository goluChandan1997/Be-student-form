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
      unique: true,
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
    studyStartDate: {
      type: Date,
      required: [true, "Study start date is required"],
    },
    studyEndDate: {
      type: Date,
      required: [true, "Study end date is required"],
      validate: {
        validator: function (value) {
          return value > this.studyStartDate;
        },
        message: "Study end date must be after start date",
      },
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

// Virtual field to calculate study duration
studentSchema.virtual("studyDuration").get(function () {
  if (this.studyStartDate && this.studyEndDate) {
    const diffTime = Math.abs(
      this.studyEndDate.getTime() - this.studyStartDate.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    return {
      totalDays: diffDays,
      years: years,
      months: months,
      days: days,
      formatted: `${
        years > 0 ? years + " year" + (years > 1 ? "s" : "") + ", " : ""
      }${months > 0 ? months + " month" + (months > 1 ? "s" : "") + ", " : ""}${
        days > 0 ? days + " day" + (days > 1 ? "s" : "") : ""
      }`,
    };
  }
  return null;
});

// Ensure virtual fields are serialized
studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

// Add index for faster queries
studentSchema.index({ mobile: 1 });
studentSchema.index({ createdAt: -1 });
studentSchema.index({ studyStartDate: 1 });
studentSchema.index({ studyEndDate: 1 });

module.exports = mongoose.model("Student", studentSchema);
