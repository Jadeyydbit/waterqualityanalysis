import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterDrops, setWaterDrops] = useState([]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Generate animated water drops
    const drops = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 3 + Math.random() * 2
    }));
    setWaterDrops(drops);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Water Quality Index",
      value: "85",
      status: "Good Quality",
      icon: "🌊",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+2.3%"
    },
    {
      title: "pH Level",
      value: "7.2",
      status: "Normal Range",
      icon: "⚗️",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "Stable"
    },
    {
      title: "Temperature",
      value: "24°C",
      status: "Optimal",
      icon: "🌡️",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "-0.5°C"
    },
    {
      title: "Dissolved Oxygen",
      value: "8.5",
      status: "Excellent",
      icon: "💨",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+1.2mg/L"
    },
    {
      title: "Total Dissolved Solids",
      value: "245",
      status: "Good",
      icon: "🔬",
      color: "from-teal-500 to-blue-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      trend: "-15ppm"
    },
    {
      title: "Turbidity",
      value: "3.2",
      status: "Clear",
      icon: "✨",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      trend: "Improved"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Water Drops */}
        {waterDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.animationDelay}s`,
              animationDuration: `${drop.animationDuration}s`,
            }}
          />
        ))}

        {/* Animated Wave Patterns */}
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none">
            <path 
              fill="#3b82f6" 
              fillOpacity="0.3"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;50,0;0,0"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Bubble Animation */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="text-6xl animate-bounce">🌊</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Mithi River Water Quality Dashboard
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-4">
              Real-time monitoring and analysis of water quality parameters
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Data • {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title}
                className="relative overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-xl hover:scale-105 transition-all duration-500 group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                
                <CardHeader className={`${stat.bgColor} border-b relative z-10`}>
                  <CardTitle className="flex items-center justify-between text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl animate-pulse">{stat.icon}</span>
                      {stat.title}
                    </span>
                    <div className="text-xs font-normal text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                      {stat.trend}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 relative z-10">
                  <div className="space-y-3">
                    <div className={`text-4xl font-bold ${stat.textColor} animate-pulse`}>
                      {stat.value}
                    </div>
                    <p className="text-gray-600 font-medium">{stat.status}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 animate-pulse`}
                        style={{ width: `${65 + (index * 5)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* ML Predictor Card */}
            <Card className="group relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <span className="text-3xl animate-bounce">🤖</span>
                  AI Water Quality Analysis
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 relative z-10">
                <p className="text-gray-600 mb-6 text-lg">
                  Use advanced machine learning models to predict and classify water quality parameters with 99%+ accuracy.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Random Forest</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Linear Regression</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">99.85% Accuracy</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                  <Link to="/dashboard/ml-predictor">
                    🚀 Launch ML Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Real-time Monitoring Card */}
            <Card className="group relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-teal-600 to-green-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <span className="text-3xl animate-spin">📊</span>
                  Live Water Monitoring
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 relative z-10">
                <p className="text-gray-600 mb-6 text-lg">
                  Monitor real-time water quality data from IoT sensors across multiple locations in the Mithi River basin.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-teal-50 p-3 rounded-lg">
                    <div className="text-sm text-teal-600 font-medium">Active Sensors</div>
                    <div className="text-2xl font-bold text-teal-700">12</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Data Points</div>
                    <div className="text-2xl font-bold text-green-700">2.4K</div>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                  <Link to="/dashboard/maps">
                    🗺️ View Live Maps
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* GIS System Card */}
            <Card className="group relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <span className="text-3xl animate-pulse">🗺️</span>
                  Advanced GIS System
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 relative z-10">
                <p className="text-gray-600 mb-6 text-lg">
                  Interactive mapping system with sensor networks, field team tracking, geofencing, and spatial analysis.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="text-sm text-indigo-600 font-medium">Sensor Network</div>
                    <div className="text-2xl font-bold text-indigo-700">6</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Field Teams</div>
                    <div className="text-2xl font-bold text-purple-700">2</div>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                  <Link to="/dashboard/gis-mapping">
                    🚀 Launch GIS System
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <span className="text-3xl animate-pulse">⚡</span>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: "Add River Data", icon: "➕", href: "/dashboard/add-river", color: "bg-blue-500" },
                  { name: "GIS Mapping", icon: "🗺️", href: "/dashboard/gis-mapping", color: "bg-indigo-500" },
                  { name: "Generate Report", icon: "📊", href: "/dashboard/reports", color: "bg-green-500" },
                  { name: "View Analytics", icon: "📈", href: "/dashboard/analytics", color: "bg-purple-500" },
                  { name: "ML Predictor", icon: "🤖", href: "/dashboard/ml-predictor", color: "bg-purple-600" },
                  { name: "System Settings", icon: "⚙️", href: "/dashboard/settings", color: "bg-orange-500" }
                ].map((action, index) => (
                  <Button
                    key={action.name}
                    asChild
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:scale-105 transition-all duration-300 border-2 hover:shadow-lg group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link to={action.href}>
                      <div className={`w-8 h-8 ${action.color} text-white rounded-full flex items-center justify-center text-lg group-hover:animate-bounce`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
