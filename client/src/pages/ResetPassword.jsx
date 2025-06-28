import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useResetPasswordMutation } from "@/features/api/authApiSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; 
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({ title: "Error", description: "Email not found. Please restart the process.", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    try {
      await resetPassword({ email, newPassword: formData.password }).unwrap();
      toast({ title: "Password Reset", description: "You can now log in with your new password." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast({
        title: "Reset Failed",
        description: err?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button className="mt-2" onClick={handleResetPassword} disabled={resetting}>
          {resetting ? "Resetting..." : "Reset Password"}
        </Button>
      </CardContent>
      <CardFooter />
    </Card>
  );
};

export default ResetPassword;
