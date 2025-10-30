import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Cleanup from "./pages/Cleanup";
import CleanupDrives from "./pages/CleanupDrives";
import News from "./pages/News";
import Profile from "./pages/Profile";
import RiverDetails from "./pages/RiverDetails";
import AddRiver from "./pages/AddRiver";
import EditRiver from "./pages/EditRiver";
import EditRiverInfo from "./pages/EditRiverInfo";
import DashboardLayout from "./components/DashboardLayout";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Maps from "./pages/Maps";
import MLPredictor from "./pages/MLPredictor";
import MLRegression from "./pages/MLRegression";
import WQIClassifier from "./pages/WQIClassifier";
import LinearRegression from "./pages/LinearRegression";
import GISMapping from "./pages/GISMapping";
import AIAnalytics from "./pages/AIAnalytics";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import PerformanceMonitor from "./components/PerformanceMonitor";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import DataExport from "./pages/DataExport";

import { FileText, Map, Calendar, Newspaper, Users } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
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
          
          {/* Demo Dashboard Route */}
          <Route
            path="/demo"
            element={
              <DashboardLayout demoMode={true}>
                <Dashboard demoMode={true} />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/ml-predictor"
            element={
              <DashboardLayout>
                <MLPredictor />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/ml-regression"
            element={
              <DashboardLayout>
                <MLRegression />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/wqi-classifier"
            element={
              <DashboardLayout>
                <WQIClassifier />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/linear-regression"
            element={
              <DashboardLayout>
                <LinearRegression />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/gis-mapping"
            element={
              <DashboardLayout>
                <GISMapping />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/ai-analytics"
            element={
              <DashboardLayout>
                <AIAnalytics />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/advanced-features"
            element={
              <DashboardLayout>
                <AdvancedFeatures />
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
                <Reports />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/cleanup"
            element={
              <DashboardLayout>
                <Cleanup />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/cleanup-drives"
            element={
              <DashboardLayout>
                <CleanupDrives />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/news"
            element={
              <DashboardLayout>
                <News />
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
            path="/dashboard/add-river"
            element={
              <DashboardLayout>
                <AddRiver />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/edit-river/:id"
            element={
              <DashboardLayout>
                <EditRiver />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/edit-river-info/:id"
            element={
              <DashboardLayout>
                <EditRiverInfo />
              </DashboardLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            }
          />

          <Route
            path="/admin/users"
            element={
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            }
          />

          <Route
            path="/admin/export"
            element={
              <DashboardLayout>
                <DataExport />
              </DashboardLayout>
            }
          />

          {/* Legacy home page */}
          <Route path="/home" element={<Index />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* Performance Monitor - only show in development and when performance is not critical */}
      {import.meta.env.DEV && <PerformanceMonitor isVisible={true} />}
    </TooltipProvider>
  </QueryClientProvider>
);

// Prevent multiple mounts in development
const container = document.getElementById("root");
if (!container._reactRootContainer) {
  const root = createRoot(container);
  container._reactRootContainer = root;
  root.render(<App />);
}
