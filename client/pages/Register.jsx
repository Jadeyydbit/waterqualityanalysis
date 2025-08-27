import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpInput } from "@/components/ui/otp-input";
import { Waves, Droplets, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("signup"); // "signup" or "otp"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Connect to backend API to create account and send OTP
      console.log("Register attempt:", formData);

      // Simulate API call to register user and send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move to OTP verification step
      setCurrentStep("otp");
      setIsLoading(false);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Connect to backend API to verify OTP
      console.log("OTP verification:", otpValue);

      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit OTP
      // In real implementation, verify against backend
      if (otpValue === "123456" || otpValue.length === 6) {
        // Redirect to login page on successful verification
        navigate("/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      // TODO: Connect to backend API to resend OTP
      console.log("Resending OTP to:", formData.email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResendLoading(false);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setCurrentStep("signup");
    setOtpValue("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 via-white to-nature-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">River Monitor</h1>
          <p className="text-gray-600">Join us in protecting our water resources</p>
        </div>

        <Card className="w-full shadow-lg">
          {currentStep === "signup" ? (
            // Signup Form
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create account</CardTitle>
                <CardDescription className="text-center">
                  Sign up to start monitoring water quality in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 animate-pulse" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-center">
                <p className="text-sm text-gray-600 w-full">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </>
          ) : (
            // OTP Verification Form
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-medium text-foreground">{formData.email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label className="text-center block">Enter verification code</Label>
                  <OtpInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={setOtpValue}
                  />
                </div>

                <Button
                  onClick={handleOtpVerification}
                  className="w-full h-11"
                  disabled={isLoading || otpValue.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 animate-pulse" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      {resendLoading ? "Sending..." : "Resend code"}
                    </button>
                  </p>

                  <button
                    type="button"
                    onClick={handleBackToSignup}
                    className="flex items-center justify-center space-x-1 text-sm text-gray-600 hover:text-gray-900 mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to signup</span>
                  </button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
