
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  // Example user data, replace with real API/user context
  const user = {
    username: "jaden123",
    email: "jaden@example.com",
    firstName: "Jaden",
    lastName: "Smith",
    avatar: "https://ui-avatars.com/api/?name=Jaden+Smith&background=random"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-white/95 shadow-2xl border-0 relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
            {user.username.slice(0,2).toUpperCase()}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</CardTitle>
          <CardDescription className="text-gray-500">User Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="block text-xs text-gray-500">Username</span>
            <span className="block text-base text-gray-800 font-medium">{user.username}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">Email</span>
            <span className="block text-base text-gray-800 font-medium">{user.email}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">First Name</span>
            <span className="block text-base text-gray-800 font-medium">{user.firstName}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">Last Name</span>
            <span className="block text-base text-gray-800 font-medium">{user.lastName}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
