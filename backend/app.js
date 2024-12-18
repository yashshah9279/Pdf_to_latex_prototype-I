const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

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
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
