// client/components/DashboardLayout.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Waves, Home, FileText, Map, Calendar, Newspaper, Settings, LogOut, Menu, Sun, Moon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const baseNavigation = [
  { name: "🏠 Home", href: "/dashboard", icon: Home },
  { name: "🤖 ML Analytics", href: "/dashboard/ml-predictor", icon: FileText },
  { name: "🏷️ WQI Classifier", href: "/dashboard/wqi-classifier", icon: FileText },
  { name: "🔮 Linear Regression", href: "/dashboard/linear-regression", icon: FileText },
  { name: "📊 Reports", href: "/dashboard/reports", icon: FileText },
  { name: "🗺️ Maps", href: "/dashboard/maps", icon: Map },
  { name: "🌿 Cleanup Drives", href: "/dashboard/cleanup", icon: Calendar },
  { name: "📰 Blog & News", href: "/dashboard/news", icon: Newspaper },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem("role") || "user");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const Sidebar = ({ className = "" }) => (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-blue-50 to-cyan-50 backdrop-blur-xl", className)}>
      <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-200/50 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
          <Waves className="w-6 h-6 text-white animate-bounce" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-white">🌊 Mithi River</span>
          <span className="text-xs text-blue-100">Water Quality Monitor</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3 relative overflow-hidden">
        {/* Background water effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-200/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
        
        {[...baseNavigation, ...(role === "admin" ? [{ name: "Admin", href: "/dashboard/admin", icon: Users }] : [])].map(
          (item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group hover:scale-105",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:text-blue-700 hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-blue-200 hover:shadow-md"
                )}
                onClick={() => setSidebarOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:animate-pulse"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl animate-pulse" />
                )}
              </Link>
            );
          }
        )}
      </nav>

      <div className="p-4 border-t border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group" 
          onClick={handleLogout}
        >
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 group-hover:animate-pulse">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none">
            <path 
              fill="#3b82f6" 
              fillOpacity="0.1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;100,0;0,0"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col relative z-10 shadow-2xl">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Navigation */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-blue-200/50 shadow-lg relative overflow-hidden">
          {/* Header background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
          
          <div className="relative flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-pulse">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Water Quality Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-300 rounded-xl group"
              >
                <div className="group-hover:animate-spin">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-transparent via-blue-50/30 to-cyan-50/30">
          {/* Floating particles in main area */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-300/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Content wrapper with enhanced styling */}
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
