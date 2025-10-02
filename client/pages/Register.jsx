import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Waves,
  AlertCircle,
  ArrowLeft,
  Smartphone,
  Mail,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Inlined OtpInput component to avoid import issues
function OtpInput({ length = 6, value, onChange, onComplete }) {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleInputChange = (e, index) => {
    const { value: inputValue } = e.target;
    if (!/^\d*$/.test(inputValue)) return;

    const newOtp = value.split('');
    newOtp[index] = inputValue.slice(-1);
    const finalOtp = newOtp.join('');
    
    onChange(finalOtp);

    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    
    if (finalOtp.length === length) {
      onComplete?.(finalOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .replace(/\D/g, "");
      
    if (pastedData.length > 0) {
       onChange(pastedData);
       if (pastedData.length === length) {
           onComplete?.(pastedData);
           inputsRef.current[length - 1]?.focus();
       }
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          pattern="\d*"
          maxLength="1"
          value={value[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
}

// This component assumes it is rendered inside a <BrowserRouter> in your main App file.
export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("phone");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

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
      const res = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number }
            : { email: formData.email }
        ),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setError("");
        setCurrentStep("otp");
        setMessage("OTP sent successfully!");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending OTP. Check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code) => {
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number, code: code }
            : { email: formData.email, code: code }
        ),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`${verificationMethod === "phone" ? "Phone" : "Email"} Verified Successfully!`);
        
        const regRes = await fetch(`/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formData.name,
            username: formData.username,
            phone_number: verificationMethod === "phone" ? formData.phone_number : null,
            email: verificationMethod === "email" ? formData.email : null,
            password: formData.password,
            confirm_password: formData.confirmPassword
          })
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.success) {
          navigate("/login");
        } else {
          setError(regData.error || "Registration failed after OTP verification.");
        }
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
      const res = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          verificationMethod === "phone"
            ? { phone: formData.phone_number }
            : { email: formData.email }
        ),
      });

      const data = await res.json();
      if (res.ok && data.success) {
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

  const backToSignup = () => {
    setCurrentStep("signup");
    setOtpValue("");
    setError("");
    setMessage("");
  };
  
  const handleOtpChange = (newOtp) => {
      if(error) {
          setError("");
      }
      setOtpValue(newOtp);
  }

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

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleChange} />
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

              <CardFooter className="text-center text-sm">
                {/* "Already have an account?" link has been removed. */}
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
                  Enter the 6-digit code sent to{" "}
                  {verificationMethod === "phone"
                    ? formData.phone_number
                    : formData.email}
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

                <OtpInput length={6} value={otpValue} onChange={handleOtpChange} onComplete={verifyOtp} />

                <Button className="w-full" onClick={() => verifyOtp(otpValue)} disabled={isLoading || otpValue.length !== 6}>
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