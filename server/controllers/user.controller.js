import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import { sendOtpEmail } from "../utils/sendOtp.js";

// In-memory store for pending registrations
const pendingRegistrations = {};

export const initiateRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long, contain one capital letter, one number, and one special character.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    pendingRegistrations[email] = { name, email, password, otp, expiresAt };
    await sendOtpEmail(email, otp, 5);
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = pendingRegistrations[email];
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No registration initiated for this email.",
      });
    }
    if (pending.expiresAt < Date.now()) {
      delete pendingRegistrations[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }
    if (pending.otp !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    // Create user
    const hashedPassword = await bcrypt.hash(pending.password, 10);
    await User.create({
      name: pending.name,
      email: pending.email,
      password: hashedPassword,
    });
    delete pendingRegistrations[email];
    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    return generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", " ", { maxage: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Faild to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password ")
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Faild to get user profile",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name, email } = req.body;
    const ProfilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //extract publicID of the Old image from the url if it exits
    if (user.photoUrl) {
      const publicID = user.photoUrl.split("/").pop().split(".")[0]; //extract public id from the url
      deleteMedia(publicID);
    }

    const cloudResponse = await uploadMedia(ProfilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password -createdAt -updatedAt -__v");
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Faild to update user profile",
    });
  }
};

export const resendOtpForRegister = async (req, res) => {
  try {
    const { email } = req.body;
    const pending = pendingRegistrations[email];
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No registration initiated for this email.",
      });
    }
    if (pending.expiresAt < Date.now()) {
      delete pendingRegistrations[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }
    // Generate new OTP and update expiry
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    pending.otp = otp;
    pending.expiresAt = expiresAt;
    await sendOtpEmail(email, otp, 5);
    return res.status(200).json({
      success: true,
      message: "OTP resent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
