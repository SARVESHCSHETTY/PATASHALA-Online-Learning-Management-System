import express from 'express';
import { getUserProfile, logout, updateUserProfile, initiateRegister, verifyRegisterOtp, resendOtpForRegister } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();
// router.route("/register").post(register) ;
router.route("/login").post(login) ;
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated,getUserProfile) ;
router.route("/profile/update").put(isAuthenticated,upload.single("profilePhoto"),updateUserProfile) ;

// Registration with OTP
router.post("/register/initiate", initiateRegister);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register/resend-otp", resendOtpForRegister);

export default router;