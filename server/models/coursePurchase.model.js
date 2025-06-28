import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderId: {
      type: String, // Razorpay order ID (from checkout session)
      required: true,
      unique: true,
    },
    paymentId: {
      type: String, // Razorpay payment ID (after payment success)
      required: false,
    },
  },
  { timestamps: true }
);

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);
