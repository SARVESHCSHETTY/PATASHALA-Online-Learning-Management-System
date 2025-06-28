
import express from 'express';
import {
  sendOtpController,
  resetPasswordController,
  verifyOtpController,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.post('/reset-password', resetPasswordController);

export default router;
