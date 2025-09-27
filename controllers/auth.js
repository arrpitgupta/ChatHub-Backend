import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    const user = await User.create({ username, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`,
      });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
