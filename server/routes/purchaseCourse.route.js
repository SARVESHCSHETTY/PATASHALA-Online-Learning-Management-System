import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  verifyPayment,
  getCourseDetailWithPurchaseStatus,
  getAllPurchasedCourse,
  testRazorpayConnection,
  getInstructorPurchasedCourses
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// Test Razorpay connection
router.get("/test-razorpay", testRazorpayConnection);

// Protected routes
router.use(isAuthenticated);
router.post("/checkout/create-checkout-session", createCheckoutSession);
router.post("/verify-payment", verifyPayment);
router.get("/course/:courseId/detail-with-status", getCourseDetailWithPurchaseStatus);
router.get("/instructor", getInstructorPurchasedCourses);
router.get("/", getAllPurchasedCourse);

export default router;