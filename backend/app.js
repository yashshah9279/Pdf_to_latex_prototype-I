const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); 
// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://yashshah9279:DcOxAdmXXdKr4vNt@twofields.htroe.mongodb.net/?retryWrites=true'; // Replace with your MongoDB Atlas URI
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the User Management API");
});

// Get All Users
app.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      // Call exportDataToCSV to export the data to CSV file
      await exportDataToCSV(users);  // Pass users data to export to CSV
      res.json(users);  // Send users as response after CSV is generated
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  });
//convert to csv

const { Parser } = require("json2csv");  // Import Parser from json2csv
const fs = require("fs"); 






const exportDataToCSV = async (users) => {
    try {
      // Specify the fields for the CSV
      const fields = ["name", "dateOfBirth"];
      const json2csvParser = new Parser({ fields });
  
      // Convert JSON data to CSV
      const csv = json2csvParser.parse(users);
  
      // Save the CSV file
      const filePath = path.join(__dirname, "users_export.csv");
      fs.writeFileSync(filePath, csv);
      console.log("Data successfully exported to CSV at:", filePath);
    } catch (err) {
      console.error("Error exporting data:", err);
    }
  };
// Add a New User
app.post("/users", async (req, res) => {
  const { name, dateOfBirth } = req.body;

  // Validate Input
  if (!name || !dateOfBirth) {
    return res.status(400).json({ error: "Name and Date of Birth are required" });
  }

  try {
    const newUser = new User({ name, dateOfBirth });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
});

// Start Server
const PORT = process.env.PfORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
