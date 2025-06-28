import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import { useSendOtpMutation, useVerifyOtpMutation } from "@/features/api/authApiSlice";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleSendOtp = async () => {
    try {
      const res = await sendOtp({ email }).unwrap();
      toast({ title: "OTP sent", description: res.message });
      setOtpSent(true);
    } catch (err) {
        if (err?.status === 404) {
            toast({
              title: "Email not found",
              description: err?.data?.error || "No account found with this email",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: err?.data?.error || "Failed to send OTP",
              variant: "destructive",
            });
          }
    }
  };
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      toast({ title: "OTP Verified", description: res.message });
      setVerified(true);
      navigate("/resetPassword", { state: { email } });
    } catch (err) {
      toast({ title: "Invalid OTP", description: err?.data?.message || "Try again", variant: "destructive" });
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-md p-4">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <Button onClick={handleSendOtp} disabled={!email}>
            Send OTP
          </Button>
        </div>

        {otpSent && (
          <>
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleVerifyOtp} disabled={!otp}>
              Verify OTP
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter>
        {verified && <p className="text-green-600 font-medium">OTP verified! You can now reset your password.</p>}
      </CardFooter>
    </Card>
  );
};

export default ForgotPassword;
