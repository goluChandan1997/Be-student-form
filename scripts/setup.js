const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

// Load environment variables
dotenv.config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("Admin already exists with email: admin@example.com");
    } else {
      // Create default admin
      const admin = new Admin({
        email: "admin@example.com",
        password: "admin123456",
      });

      await admin.save();
      console.log("Default admin created:");
      console.log("Email: admin@example.com");
      console.log("Password: admin123456");
      console.log("");
      console.log(
        "⚠️  IMPORTANT: Please change the default password after first login!"
      );
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

setupDatabase();
