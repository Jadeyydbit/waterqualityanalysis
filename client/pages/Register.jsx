// client/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Droplets } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || ""; // e.g. http://localhost:8080

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/register`, {
        username,
        email,
        password,
      });

      if (res.data && res.data.success) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        const err = res.data?.error || "Registration failed";
        alert(err);
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || error.message || "Registration failed";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
        </Card>
      </div>
    </div>
  );
}
