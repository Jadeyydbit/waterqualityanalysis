import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import RiverDetails from "./pages/RiverDetails";
import Admin from "./pages/Admin";
import AddRiver from "./pages/AddRiver";
import EditRiver from "./pages/EditRiver";
import EditRiverInfo from "./pages/EditRiverInfo";
import DashboardLayout from "./components/DashboardLayout";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Maps from "./pages/Maps";

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
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/rivers/:slug"
            element={
              <DashboardLayout>
                <RiverDetails />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/reports"
            element={
              <DashboardLayout>
                <PlaceholderPage
                  title="Pollution Reports"
                  description="Citizens can report garbage and pollution with text and image uploads here."
                  icon={<FileText className="w-8 h-8 text-muted-foreground" />}
                />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/maps"
            element={
              <DashboardLayout>
                <Maps />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/cleanup"
            element={
              <DashboardLayout>
                <PlaceholderPage
                  title="Cleanup Drives"
                  description="Register as a volunteer and view upcoming cleanup events."
                  icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
                />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/news"
            element={
              <DashboardLayout>
                <PlaceholderPage
                  title="Blog & News"
                  description="Read awareness articles and latest news about water conservation."
                  icon={<Newspaper className="w-8 h-8 text-muted-foreground" />}
                />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <DashboardLayout>
                <Admin />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/admin/rivers/new"
            element={
              <DashboardLayout>
                <AddRiver />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/admin/rivers/:slug/edit"
            element={
              <DashboardLayout>
                <EditRiver />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/admin/rivers/:slug/edit-info"
            element={
              <DashboardLayout>
                <EditRiverInfo />
              </DashboardLayout>
            }
          />

          {/* Legacy home page */}
          <Route path="/home" element={<Index />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
import ResetPassword from "@/pages/ResetPassword";

<Routes>
  {/* Other routes */}
  <Route path="/reset-password" element={<ResetPassword />} />
</Routes>
