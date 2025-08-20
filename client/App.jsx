import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";
import NotFound from "./pages/NotFound";
import { FileText, Map, Calendar, Newspaper, Users } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/dashboard/reports" element={
            <DashboardLayout>
              <PlaceholderPage
                title="Pollution Reports"
                description="Citizens can report garbage and pollution with text and image uploads here."
                icon={<FileText className="w-8 h-8 text-muted-foreground" />}
              />
            </DashboardLayout>
          } />
          <Route path="/dashboard/maps" element={
            <DashboardLayout>
              <PlaceholderPage
                title="Interactive Maps"
                description="View pollution levels across rivers on an interactive map."
                icon={<Map className="w-8 h-8 text-muted-foreground" />}
              />
            </DashboardLayout>
          } />
          <Route path="/dashboard/cleanup" element={
            <DashboardLayout>
              <PlaceholderPage
                title="Cleanup Drives"
                description="Register as a volunteer and view upcoming cleanup events."
                icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
              />
            </DashboardLayout>
          } />
          <Route path="/dashboard/news" element={
            <DashboardLayout>
              <PlaceholderPage
                title="Blog & News"
                description="Read awareness articles and latest news about water conservation."
                icon={<Newspaper className="w-8 h-8 text-muted-foreground" />}
              />
            </DashboardLayout>
          } />
          <Route path="/dashboard/admin" element={
            <DashboardLayout>
              <PlaceholderPage
                title="Admin Dashboard"
                description="Manage users and moderate pollution reports."
                icon={<Users className="w-8 h-8 text-muted-foreground" />}
              />
            </DashboardLayout>
          } />

          {/* Legacy home page - redirect to login */}
          <Route path="/home" element={<Index />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
