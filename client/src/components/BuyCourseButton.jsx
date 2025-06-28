import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation, useVerifyPaymentMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [createCheckoutSession, { isLoading, isError, error }] =
    useCreateCheckoutSessionMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const purchaseCourseHandler = async () => {
    if (!user) {
      toast.error("Please login to purchase the course");
      navigate("/login");
      return;
    }

    try {
      const res = await createCheckoutSession({courseId}).unwrap();

      const { orderId, amount, currency, key } = res;

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key,
        amount,
        currency,
        name: "Your Course Platform",
        description: "Course Purchase",
        order_id: orderId,
        handler: async function (response) {
          try {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await verifyPayment(paymentData).unwrap();
            if (verifyRes.success) {
              toast.success("Payment successful!");
              navigate(`/course-progress/${courseId}`);
              window.location.reload();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Failed to initiate purchase. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.data?.message || "Failed to create checkout session";
      toast.error(errorMessage);
      if (error?.status === 401) {
        navigate("/login");
      }
    }
  }, [isError, error, navigate]);

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton; // ✅ EXPORT properly at the end
