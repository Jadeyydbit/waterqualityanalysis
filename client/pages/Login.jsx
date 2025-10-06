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

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      if (res.data && res.data.success) {
        localStorage.setItem("role", res.data.role || "user");
        window.location.href = "/dashboard";
      } else {
        alert(res.data?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error?.response?.data?.error || "Login failed");
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

        {/* Login Card */}
        <Card className="w-full shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-blue-50 p-6 text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Welcome Back</CardTitle>
            <CardDescription className="text-blue-700">
              Sign in to monitor water quality across your region
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
                  autoComplete="off"
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
                  autoComplete="off"
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
