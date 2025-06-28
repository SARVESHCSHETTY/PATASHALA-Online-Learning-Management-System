import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { sendPurchaseSuccessEmail } from "../utils/sendOtp.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  Test Razorpay
export const testRazorpayConnection = async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "test_receipt",
    });

    res.status(200).json({
      success: true,
      message: "Razorpay connection successful",
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Razorpay connection failed",
      error: error.message,
    });
  }
};

//  Create Razorpay Order
export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.id;

    if (!courseId) return res.status(400).json({ success: false, message: "Course ID required" });

    const course = await Course.findById(courseId);
    if (!course || course.coursePrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course or price" });
    }

    const order = await razorpay.orders.create({
      amount: course.coursePrice * 100,
      currency: "INR",
      receipt: `rcpt_${courseId}_${userId}`.slice(0, 40),
      notes: { courseId, userId },
    });

    await new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      orderId: order.id,
      status: "pending",
    }).save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const purchase = await CoursePurchase.findOne({ orderId: razorpay_order_id }).populate("courseId");
    if (!purchase) return res.status(404).json({ success: false, message: "Purchase not found" });

    purchase.status = "completed";
    await purchase.save();

    if (purchase.courseId?.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await User.findByIdAndUpdate(purchase.userId, {
      $addToSet: { enrolledCourses: purchase.courseId._id },
    });

    await Course.findByIdAndUpdate(purchase.courseId._id, {
      $addToSet: { enrolledStudents: purchase.userId },
    });

    const user = await User.findById(purchase.userId);
    const course = await Course.findById(purchase.courseId._id).populate("creator").populate("lectures");
    if (user && user.email && course) {
      await sendPurchaseSuccessEmail(user.email, course);
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get Course Detail & Purchase Status
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const purchased = await CoursePurchase.findOne({
      userId: req.id,
      courseId: req.params.courseId,
      status: "completed",
    });

    res.status(200).json({ course, purchased: !!purchased });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Admin - All Purchased Courses
export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchases = await CoursePurchase.find({ status: "completed" }).populate("courseId");
    res.status(200).json({ purchasedCourse: purchases });
  } catch (error) {
    res.status(500).json({ purchasedCourse: [] });
  }
};

// Get Purchased Courses for Current Instructor
export const getInstructorPurchasedCourses = async (req, res) => {
  try {
    // Find courses created by this instructor
    const instructorCourses = await Course.find({ creator: req.id }).select('_id');
    const courseIds = instructorCourses.map(c => c._id);

    // Find purchases for these courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("courseId");

    res.status(200).json({ purchasedCourse: purchases });
  } catch (error) {
    res.status(500).json({ purchasedCourse: [] });
  }
};
