import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Waves, Home, FileText, Map, Calendar, Newspaper, LogOut, Menu, Sun, Moon, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "🏠 Home", href: "/dashboard", icon: Home },
  { name: "✨ Advanced Features", href: "/dashboard/advanced-features", icon: FileText },
  { name: "🤖 ML Analytics", href: "/dashboard/ml-predictor", icon: FileText },
  { name: "🧠 AI Analytics", href: "/dashboard/ai-analytics", icon: FileText },
  { name: "🏷️ WQI Classifier", href: "/dashboard/wqi-classifier", icon: FileText },
  { name: "🔮 Linear Regression", href: "/dashboard/linear-regression", icon: FileText },
  { name: "🗺️ GIS Mapping", href: "/dashboard/gis-mapping", icon: Map },
  { name: "📊 Reports", href: "/dashboard/reports", icon: FileText },
  { name: "🌿 Cleanup Drives", href: "/dashboard/cleanup", icon: Calendar },
  { name: "📰 Blog & News", href: "/dashboard/news", icon: Newspaper },
];

export default function DashboardLayout({ children, demoMode = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const role = localStorage.getItem("role") || "user";

  // Filter navigation items based on search query
  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.href.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (href) => {
    navigate(href);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.length > 0);
  };

  // Demo mode alert function
  const showDemoAlert = () => {
    alert("🔐 Please register to access full features and functionality. This is a demo version with limited access.");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-cyan-50 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-200/50 bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
              <Waves className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">🌊 Mithi River</span>
              <span className="text-xs text-blue-100">Water Quality Monitor</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              if (demoMode && item.href !== "/dashboard") {
                return (
                  <button
                    key={item.href}
                    onClick={showDemoAlert}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 w-full text-left",
                      "text-blue-700 hover:bg-white/40 hover:text-blue-900 hover:scale-105"
                    )}
                  >
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                      : "text-blue-700 hover:bg-white/40 hover:text-blue-900 hover:scale-105"
                  )}
                >
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-blue-200/50">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-sm border shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle>
            <VisuallyHidden>Navigation Menu</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-cyan-50">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-200/50 bg-gradient-to-r from-blue-600 to-cyan-600">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">🌊 Mithi River</span>
                <span className="text-xs text-blue-100">Water Quality Monitor</span>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                
                if (demoMode && item.href !== "/dashboard") {
                  return (
                    <button
                      key={item.href}
                      onClick={showDemoAlert}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 w-full text-left",
                        "text-blue-700 hover:bg-white/40 hover:text-blue-900"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "text-blue-700 hover:bg-white/40 hover:text-blue-900"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-72">
        {/* Top Header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-blue-200/50 bg-white/80 backdrop-blur-xl px-4 shadow-sm">
          <div className="flex flex-1 items-center gap-x-4">
            <div className="relative flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Type to navigate to any page..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="pl-10 bg-white/60 backdrop-blur-sm border-blue-200/50"
                />
                
                {/* Dropdown with navigation suggestions */}
                {showDropdown && filteredNavigation.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200/50 rounded-lg shadow-lg backdrop-blur-xl z-50 max-h-60 overflow-y-auto">
                    {filteredNavigation.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleSearchSelect(item.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <item.icon className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{item.href.replace('/dashboard', '').replace('/', '') || 'home'}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showDropdown && searchQuery && filteredNavigation.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200/50 rounded-lg shadow-lg backdrop-blur-xl z-50 p-4">
                    <p className="text-sm text-gray-500 text-center">No pages found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                      {role === "admin" ? "AD" : "US"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Water Quality Team</p>
                    <p className="text-xs text-muted-foreground capitalize">{role} Account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
