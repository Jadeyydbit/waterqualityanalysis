// client/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call your backend API for password reset here
      // Example:
      // await axios.post("http://127.0.0.1:8000/api/password-reset/", { email });

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setEmailSent(true);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Failed to send reset link. Please try again.");
      setIsLoading(false);
    }
  };

  // Email sent view
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full shadow-lg mb-4 animate-pulse">
              <Waves className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">River Monitor</h1>
          </div>

          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center bg-cyan-50 p-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-nature-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">Check your email</CardTitle>
              <CardDescription className="text-blue-700">
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Try again
              </Button>
            </CardContent>

            <CardFooter className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-blue-800 hover:underline font-medium flex items-center justify-center space-x-1 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Normal forgot password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full shadow-lg mb-4 animate-pulse">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">River Monitor</h1>
          <p className="text-blue-700">Reset your password</p>
        </div>

        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 p-6 text-center bg-blue-50">
            <CardTitle className="text-2xl font-bold text-blue-900">Forgot password?</CardTitle>
            <CardDescription className="text-blue-700">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-blue-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Mail className="w-5 h-5 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center bg-blue-50 py-4">
            <Link 
              to="/login" 
              className="text-sm text-blue-800 hover:underline font-medium flex items-center justify-center space-x-1 w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
