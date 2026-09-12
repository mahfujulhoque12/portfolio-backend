import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// =========================
// SIGNUP
// =========================

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id.toString());

    // Development cookie
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =========================
// LOGIN
// =========================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", {
      email,
      password,
    });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    console.log("NORMALIZED EMAIL:", normalizedEmail);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    console.log("USER FOUND:", !!user);

    if (!user) {
      console.log("❌ USER NOT FOUND");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("USER EMAIL:", user.email);
    console.log("PASSWORD EXISTS:", !!user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("PASSWORD VALID:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ PASSWORD DOES NOT MATCH");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =========================
// LOGOUT
// =========================

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
