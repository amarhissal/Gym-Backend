const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const app = express();
// Allow all origins
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.db, {
    // options not needed in latest driver
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Schemas and Models ----------------
const BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  content: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  number: String,
  plan: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);
const User = mongoose.model("User", UserSchema);

// ---------------- Blog Routes ----------------
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

app.post("/blogs", async (req, res) => {
  const { title, image, description, content } = req.body;
  try {
    const newBlog = new Blog({ title, image, description, content });
    await newBlog.save();
    res.json({ message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error adding blog" });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

// ---------------- User Routes ----------------
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.post("/users", async (req, res) => {
  const { name, age, email, number, plan, isAdmin } = req.body;
  try {
    const newUser = new User({ name, age, email, number, plan, isAdmin });
    await newUser.save();
    res.json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
