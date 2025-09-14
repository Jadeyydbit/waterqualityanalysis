import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpInput } from "@/components/ui/otp-input";
import { Waves, Droplets, AlertCircle, ArrowLeft, Smartphone, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("phone"); // "phone" or "email"

  const API_BASE = "http://127.0.0.1:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Send OTP (phone or email) with password validation
  const sendOtp = async () => {
    setError("");
    setMessage("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (verificationMethod === "phone") {
      const phoneDigits = formData.phone_number.replace(/\D/g, "");
      const formattedPhone = phoneDigits.startsWith("91")
        ? `+${phoneDigits}`
        : `+91${phoneDigits}`;
      if (!/^\+91\d{10}$/.test(formattedPhone)) {
        setError("Enter a valid 10-digit Indian phone number");
        return;
      }
      setFormData((prev) => ({ ...prev, phone_number: formattedPhone }));
    } else {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Enter a valid email address");
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number }
            : { email: formData.email }
        ),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStep("otp");
        setMessage("OTP sent successfully!");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending OTP. Check backend.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
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
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number, code: otpValue }
            : { email: formData.email, code: otpValue }
        ),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`🎉 ${verificationMethod === "phone" ? "Phone" : "Email"} Verified Successfully!`);
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number }
            : { email: formData.email }
        ),
      });
      const data = await res.json();
      if (data.success) setMessage("OTP resent successfully!");
      else setError(data.message || "Failed to resend OTP");
    } catch (err) {
      console.error(err);
      setError("Error resending OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  const backToSignup = () => {
    setCurrentStep("signup");
    setOtpValue("");
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-water-50 via-white to-nature-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg w-full">
          {currentStep === "signup" ? (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                  Sign up to start monitoring water quality in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="flex justify-between space-x-2">
                  <Button
                    variant={verificationMethod === "phone" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setVerificationMethod("phone")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" /> Phone
                  </Button>
                  <Button
                    variant={verificationMethod === "email" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setVerificationMethod("email")}
                  >
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </Button>
                </div>

                {verificationMethod === "phone" ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                </div>

                <Button className="w-full" onClick={sendOtp} disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Sign Up & Verify"}
                </Button>
              </CardContent>
              <CardFooter className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Already have an account? Sign in</Link>
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  {verificationMethod === "phone" ? (
                    <Smartphone className="w-8 h-8 text-primary" />
                  ) : (
                    <Mail className="w-8 h-8 text-primary" />
                  )}
                </div>
                <CardTitle>Verify your {verificationMethod}</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to {verificationMethod === "phone" ? formData.phone_number : formData.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <OtpInput length={6} value={otpValue} onChange={setOtpValue} onComplete={verifyOtp} />

                <Button className="w-full" onClick={verifyOtp} disabled={isLoading || otpValue.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm">
                    Didn't receive the code?{" "}
                    <button onClick={resendOtp} disabled={resendLoading} className="text-primary hover:underline disabled:opacity-50">
                      {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  </p>

                  <button onClick={backToSignup} className="flex items-center justify-center space-x-1 text-sm text-gray-600 hover:text-gray-900 mx-auto">
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
