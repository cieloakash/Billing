import { genToken } from "../lib/tokenGen.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Input validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!["admin", "sales", "logistic"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
        error: `Role ${role} is not allowed. Required roles: admin, sales, logistic`
      });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password length must be greater than 6" });
    }

    // Check existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        password:newUser.password
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// login route
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const user = await User.findOne({ username }).select("+password");;
    console.log(user);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const verifyPass = await bcrypt.compare(password,user.password)

    if(!verifyPass){
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    genToken(user._id,user.role,res);
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logout route

export const logout= async(req,res)=>{
  try {
    res.cookie("jwtoken","",{maxAge:0});
    res.status(200).json({ message: "logout sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        role: req.user.role
      }
    });
  } catch (error) {
    // console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};