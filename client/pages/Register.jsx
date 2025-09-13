import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OtpInput } from "@/components/ui/otp-input";
import { Waves, Droplets, AlertCircle, ArrowLeft, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Backend URL
  const API_BASE = "http://127.0.0.1:5000";

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // ✅ Submit Signup Form → Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Format phone number
    const phoneDigits = formData.phone_number.replace(/\D/g, "");
    const formattedPhoneNumber = phoneDigits.startsWith("91")
      ? `+${phoneDigits}`
      : `+91${phoneDigits}`;

    if (!/^\+91\d{10}$/.test(formattedPhoneNumber)) {
      setError("Enter a valid 10-digit Indian phone number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhoneNumber }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (data.success) {
        setFormData((prev) => ({ ...prev, phone_number: formattedPhoneNumber }));
        setCurrentStep("otp");
        setMessage("OTP sent successfully!");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending OTP. Check if backend is running and CORS is set.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleOtpVerification = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone_number,
          code: otpValue,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (data.success) {
        setMessage("🎉 Phone Verified Successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying OTP. Check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone_number }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (data.success) {
        setMessage("OTP resent successfully!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error resending OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setCurrentStep("signup");
    setOtpValue("");
    setError("");
    setMessage("");
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
                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
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
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="+919876543210"
                      value={formData.phone_number}
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

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
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
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Verify your phone number</CardTitle>
                <CardDescription className="text-center">
                  We've sent a 6-digit verification code to <br />
                  <span className="font-medium text-foreground">{formData.phone_number}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label className="text-center block">Enter verification code</Label>
                  <OtpInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={handleOtpVerification}
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
