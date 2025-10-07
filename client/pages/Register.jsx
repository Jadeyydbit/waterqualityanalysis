<<<<<<< HEAD
// client/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import { Waves, Droplets } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || ""; // e.g. http://localhost:8080
=======
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
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
<<<<<<< HEAD
      const res = await axios.post(`${API_BASE}/api/register`, {
        username,
        email,
        password,
      });

      if (res.data && res.data.success) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
=======
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
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
      } else {
        const err = res.data?.error || "Registration failed";
        alert(err);
      }
<<<<<<< HEAD
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || error.message || "Registration failed";
      alert(msg);
=======
    } catch (err) {
      console.error(err);
      setError("Error sending OTP. Check backend.");
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
<<<<<<< HEAD
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full shadow-lg mb-4 animate-pulse">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Water Quality Monitor</h1>
          <p className="text-blue-700">Protecting our rivers and water resources</p>
        </div>

        {/* Register Card */}
        <Card className="w-full shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-blue-50 p-6 text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Create Account</CardTitle>
            <CardDescription className="text-blue-700">
              Sign up to access the water quality dashboard
            </CardDescription>
          </CardHeader>
=======
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
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-medium text-blue-800">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                />
              </div>

<<<<<<< HEAD
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-blue-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-blue-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                />
              </div>
=======
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
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Droplets className="w-5 h-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>

<<<<<<< HEAD
          <CardFooter className="bg-blue-50 text-center py-4">
            <p className="text-sm text-blue-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-800 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
=======
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
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
        </Card>
      </div>
    </div>
  );
}
