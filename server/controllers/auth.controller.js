import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { sendOtpEmail } from "../utils/sendOtp.js"; 


const otpStore = {};


export const sendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
  
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "No account exists with this email" });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

   
    otpStore[email] = { otp, expiresAt };


    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ error: "No OTP sent to this email" });
  }

  const { otp: savedOtp, expiresAt } = otpStore[email];

  if (Date.now() > expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired" });
  }

  if (savedOtp !== Number(otp))
    {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
};


export const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
