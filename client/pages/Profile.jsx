
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  // Example user data, replace with real API call
  const [user, setUser] = useState({
    username: "alexarawles", // Example username
    fullName: "Alexa Rawles",
    nickName: "Alexa",
    email: "alexarawles@gmail.com",
    gender: "",
    country: "",
    language: "",
    timeZone: "",
    avatar: "https://ui-avatars.com/api/?name=User&background=random", // Default avatar
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEdit = () => {
    setEditMode(true);
    setForm(user);
  };
  const handleSave = () => {
    setUser(form);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // TODO: Call backend API to change password
    setMessage("Password changed successfully!");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt="User" />
            <AvatarFallback>{user.username ? user.username[0].toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-semibold">{user.fullName}</div>
            <div className="text-gray-500">{user.email}</div>
            <div className="text-gray-400 text-sm">Username: <span className="font-mono">{user.username}</span></div>
            <Button size="sm" className="mt-2" onClick={handleEdit} disabled={editMode}>
              Edit
            </Button>
          </div>
        </div>
        <form className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <Input name="fullName" value={form.fullName} onChange={handleChange} disabled={false} />
          </div>
          <div>
            <label className="block text-sm font-medium">Nick Name</label>
            <Input name="nickName" value={form.nickName} onChange={handleChange} disabled={false} />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <Input name="gender" value={form.gender} onChange={handleChange} disabled={false} />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <Input name="country" value={form.country} onChange={handleChange} disabled={false} />
          </div>
          <div>
            <label className="block text-sm font-medium">Language</label>
            <Input name="language" value={form.language} onChange={handleChange} disabled={false} />
          </div>
          <div>
            <label className="block text-sm font-medium">Time Zone</label>
            <Input name="timeZone" value={form.timeZone} onChange={handleChange} disabled={false} />
          </div>
        </form>
        {editMode && (
          <Button className="mb-8" onClick={handleSave}>
            Save Changes
          </Button>
        )}
        <div className="mb-8">
          <div className="font-semibold mb-2">My email Address</div>
          <div className="flex items-center gap-2">
            <Input value={user.email} disabled />
            <Button size="sm" variant="outline">+ Add Email Address</Button>
          </div>
          <div className="text-xs text-gray-400 mt-1">1 month ago</div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="font-semibold mb-2">Change Password</div>
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Change Password</Button>
          {message && <div className="text-center text-sm text-red-500">{message}</div>}
        </form>
      </div>
    </div>
  );
}
