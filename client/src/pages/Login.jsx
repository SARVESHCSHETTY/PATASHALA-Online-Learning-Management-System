import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useRef } from "react";
import {
  useInitiateRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useLoginUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const timerRef = useRef();

  const [initiateRegister, { data: initiateData, error: initiateError, isLoading: initiateIsLoading, isSuccess: initiateIsSuccess }] = useInitiateRegisterMutation();
  const [verifyRegisterOtp, { data: verifyData, error: verifyError, isLoading: verifyIsLoading, isSuccess: verifyIsSuccess }] = useVerifyRegisterOtpMutation();
  const [resendRegisterOtp, { data: resendData, error: resendError, isLoading: resendIsLoading, isSuccess: resendIsSuccess }] = useResendRegisterOtpMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput(prev => ({ ...prev, [name]: value }));
    } else {
      setLoginInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInitiateRegistration = async () => {
    const { name, email, password } = signupInput;
    const passwordRequirements = [
      { regex: /.{6,}/, message: "at least 6 characters" },
      { regex: /[A-Z]/, message: "one uppercase letter" },
      { regex: /[0-9]/, message: "one number" },
      { regex: /[^A-Za-z0-9]/, message: "one special character" },
    ];
    const failed = passwordRequirements.filter(req => !req.regex.test(password));
    if (failed.length > 0) {
      toast.error(`Password must contain ${failed.map(f => f.message).join(", ")}.`);
      return;
    }
    await initiateRegister({ name, email, password });
    setPendingEmail(email);
  };

  const handleVerifyOtp = async () => {
    await verifyRegisterOtp({ email: pendingEmail, otp });
  };

  const handleResendOtp = async () => {
    await resendRegisterOtp({ email: pendingEmail });
  };

  const handleLogin = async () => {
    await loginUser(loginInput);
  };

  useEffect(() => {
    if (initiateIsSuccess && initiateData) {
      toast.success(initiateData?.message || "OTP sent to your email");
      setShowOtpInput(true);
    }
    if (initiateError) {
      toast.error(initiateError?.data?.message || "Failed to send OTP");
    }
  }, [initiateIsSuccess, initiateError]);

  useEffect(() => {
    if (verifyIsSuccess && verifyData) {
      toast.success(verifyData?.message || "Account Created successfully");
      setShowOtpInput(false);
      setSignupInput({ name: "", email: "", password: "" });
      setOtp("");
    }
    if (verifyError) {
      toast.error(verifyError?.data?.message || "OTP verification failed");
    }
  }, [verifyIsSuccess, verifyError]);

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData?.message || `Welcome back ${loginData?.user?.name}`);
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed");
    }
  }, [loginIsSuccess, loginError]);

  useEffect(() => {
    if (resendIsSuccess && resendData) {
      toast.success(resendData?.message || "OTP resent to your email");
    }
    if (resendError) {
      toast.error(resendError?.data?.message || "Failed to resend OTP");
    }
  }, [resendIsSuccess, resendError]);

  useEffect(() => {
    if (showOtpInput) {
      setOtpTimer(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showOtpInput, resendIsSuccess]);

  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Signup */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a New Account and click Signup when you're done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!showOtpInput ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")} placeholder="Enter Your Name" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} placeholder="Enter Your email" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} placeholder="Enter Your password" required />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="otp">Enter OTP sent to your email</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="link" className="p-0" disabled={resendIsLoading || otpTimer > 0} onClick={handleResendOtp}>
                      {resendIsLoading ? "Resending..." : "Resend OTP"}
                    </Button>
                    {otpTimer > 0 && <span className="text-xs text-gray-500">Resend in {otpTimer}s</span>}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!showOtpInput ? (
                <Button disabled={initiateIsLoading} onClick={handleInitiateRegistration}>
                  {initiateIsLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />please wait :</> : "Signup"}
                </Button>
              ) : (
                <Button disabled={verifyIsLoading} onClick={handleVerifyOtp}>
                  {verifyIsLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />please wait :</> : "Verify OTP"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login using your credentials. After signup, you will be logged in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" value={loginInput.email} onChange={(e) => changeInputHandler(e, "login")} placeholder="Enter Your email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" value={loginInput.password} onChange={(e) => changeInputHandler(e, "login")} placeholder="Enter Your password" required />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button disabled={loginIsLoading} onClick={handleLogin}>
                {loginIsLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />please wait :</> : "Login"}
              </Button>
              <Link to="/forgotPassword" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
