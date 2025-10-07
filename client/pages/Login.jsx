// client/pages/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Waves, Droplets } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
<<<<<<< HEAD

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      if (res.data && res.data.success) {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error?.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
=======
    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.success) {
        localStorage.setItem("role", data.role);
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (e) {
      setIsLoading(false);
      alert("Login failed");
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
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

<<<<<<< HEAD
        {/* Login Card */}
        <Card className="w-full shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-blue-50 p-6 text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Welcome Back</CardTitle>
            <CardDescription className="text-blue-700">
              Sign in to monitor water quality across your region
=======
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to access the water quality dashboard
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
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
<<<<<<< HEAD
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                  autoComplete="off"
=======
                  className="h-11"
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
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
<<<<<<< HEAD
                  className="h-12 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                  autoComplete="off"
=======
                  className="h-11"
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember" className="text-sm text-blue-700 font-medium">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Droplets className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-blue-50 text-center py-4">
            <p className="text-sm text-blue-700">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
