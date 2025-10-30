import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, Droplets } from "lucide-react";
import { sampleData, debounce } from "@/lib/performance";

const Dashboard = React.memo(function Dashboard({ demoMode = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterDrops, setWaterDrops] = useState([]);
  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo mode alert function
  const showDemoAlert = () => {
    alert("🔐 Please register to access full features and functionality. This is a demo version with limited access.");
  };

  // Fetch real data from Django API
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Real data fetched:', data);
        setRealData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch real dashboard data:', err);
        setError(err.message);
        // Fall back to static data if API fails
        setRealData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
    
    // Refresh data every 30 seconds to simulate real-time updates
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Use real data if available, otherwise fall back to static data
  const stats = useMemo(() => {
    if (realData && realData.success && realData.current_stats) {
      const data = realData.current_stats;
      return [
        {
          title: "Water Quality Index",
          value: data.water_quality_index?.value || "Poor",
          status: `${data.water_quality_index?.samples || 0} samples`,
          icon: "🌊",
          color: data.water_quality_index?.value === 'Good' ? "from-green-500 to-emerald-600" : 
                 data.water_quality_index?.value === 'Moderate' ? "from-blue-500 to-cyan-600" : "from-red-500 to-orange-600",
          bgColor: data.water_quality_index?.value === 'Good' ? "bg-green-50" : 
                   data.water_quality_index?.value === 'Moderate' ? "bg-blue-50" : "bg-red-50",
          textColor: data.water_quality_index?.value === 'Good' ? "text-green-600" : 
                     data.water_quality_index?.value === 'Moderate' ? "text-blue-600" : "text-red-600",
          trend: `${realData.dataset_info?.latest_year || 2024} data`
        },
        {
          title: "pH Level",
          value: data.ph?.value || "7.0",
          status: data.ph?.status?.message || "Normal Range",
          icon: "⚗️",
          color: data.ph?.status?.color === 'green' ? "from-green-500 to-emerald-600" : 
                 data.ph?.status?.color === 'blue' ? "from-blue-500 to-cyan-600" : 
                 data.ph?.status?.color === 'orange' ? "from-orange-500 to-yellow-600" : "from-red-500 to-orange-600",
          bgColor: data.ph?.status?.color === 'green' ? "bg-green-50" : 
                   data.ph?.status?.color === 'blue' ? "bg-blue-50" : 
                   data.ph?.status?.color === 'orange' ? "bg-orange-50" : "bg-red-50",
          textColor: data.ph?.status?.color === 'green' ? "text-green-600" : 
                     data.ph?.status?.color === 'blue' ? "text-blue-600" : 
                     data.ph?.status?.color === 'orange' ? "text-orange-600" : "text-red-600",
          trend: `Range: ${data.ph?.min}-${data.ph?.max}`
        },
        {
          title: "Temperature",
          value: `${data.temperature?.value || 25}°C`,
          status: data.temperature?.status?.message || "Optimal",
          icon: "🌡️",
          color: data.temperature?.status?.color === 'green' ? "from-orange-500 to-red-500" : 
                 data.temperature?.status?.color === 'blue' ? "from-blue-500 to-cyan-600" : "from-orange-500 to-red-500",
          bgColor: data.temperature?.status?.color === 'green' ? "bg-orange-50" : 
                   data.temperature?.status?.color === 'blue' ? "bg-blue-50" : "bg-orange-50",
          textColor: data.temperature?.status?.color === 'green' ? "text-orange-600" : 
                     data.temperature?.status?.color === 'blue' ? "text-blue-600" : "text-orange-600",
          trend: `${data.temperature?.min}°C - ${data.temperature?.max}°C`
        },
        {
          title: "Dissolved Oxygen",
          value: `${data.dissolved_oxygen?.value || 5.5}`,
          status: data.dissolved_oxygen?.status?.message || "Good",
          icon: "💨",
          color: data.dissolved_oxygen?.status?.color === 'green' ? "from-purple-500 to-pink-600" : 
                 data.dissolved_oxygen?.status?.color === 'blue' ? "from-blue-500 to-purple-600" : "from-red-500 to-orange-600",
          bgColor: data.dissolved_oxygen?.status?.color === 'green' ? "bg-purple-50" : 
                   data.dissolved_oxygen?.status?.color === 'blue' ? "bg-blue-50" : "bg-red-50",
          textColor: data.dissolved_oxygen?.status?.color === 'green' ? "text-purple-600" : 
                     data.dissolved_oxygen?.status?.color === 'blue' ? "text-blue-600" : "text-red-600",
          trend: `${data.dissolved_oxygen?.min}-${data.dissolved_oxygen?.max} mg/L`
        },
        {
          title: "Total Dissolved Solids",
          value: `${data.tds?.value || 2500}`,
          status: data.tds?.status?.message || "Poor",
          icon: "🔬",
          color: data.tds?.status?.color === 'green' ? "from-teal-500 to-blue-600" : 
                 data.tds?.status?.color === 'blue' ? "from-blue-500 to-teal-600" : 
                 data.tds?.status?.color === 'orange' ? "from-orange-500 to-yellow-600" : "from-red-500 to-pink-600",
          bgColor: data.tds?.status?.color === 'green' ? "bg-teal-50" : 
                   data.tds?.status?.color === 'blue' ? "bg-blue-50" : 
                   data.tds?.status?.color === 'orange' ? "bg-orange-50" : "bg-red-50",
          textColor: data.tds?.status?.color === 'green' ? "text-teal-600" : 
                     data.tds?.status?.color === 'blue' ? "text-blue-600" : 
                     data.tds?.status?.color === 'orange' ? "text-orange-600" : "text-red-600",
          trend: `${data.tds?.min}-${data.tds?.max} ppm`
        },
        {
          title: "BOD Level",
          value: `${data.bod?.value || 10.5}`,
          status: data.bod?.status?.message || "High",
          icon: "✨",
          color: data.bod?.status?.color === 'green' ? "from-indigo-500 to-purple-600" : 
                 data.bod?.status?.color === 'blue' ? "from-blue-500 to-indigo-600" : "from-red-500 to-orange-600",
          bgColor: data.bod?.status?.color === 'green' ? "bg-indigo-50" : 
                   data.bod?.status?.color === 'blue' ? "bg-blue-50" : "bg-red-50",
          textColor: data.bod?.status?.color === 'green' ? "text-indigo-600" : 
                     data.bod?.status?.color === 'blue' ? "text-blue-600" : "text-red-600",
          trend: `${data.bod?.min}-${data.bod?.max} mg/L`
        }
      ];
    }
    
    // Fallback static data
    return [
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
        title: "BOD Level",
        value: "3.2",
        status: "Clear",
        icon: "✨",
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-600",
        trend: "Improved"
      }
    ];
  }, [realData]);

  // Memoized data generation for better performance - use real data if available
  const mithiTrendData = useMemo(() => {
    if (realData && realData.success && realData.trend_data) {
      return realData.trend_data;
    }
    
    // Fallback static data
    return [
      { day: 'Mon', wqi: 68, pH: 7.2, DO: 6.8, temp: 24 },
      { day: 'Tue', wqi: 72, pH: 7.4, DO: 7.1, temp: 25 },
      { day: 'Wed', wqi: 69, pH: 7.1, DO: 6.9, temp: 23 },
      { day: 'Thu', wqi: 75, pH: 7.6, DO: 7.4, temp: 26 },
      { day: 'Fri', wqi: 71, pH: 7.3, DO: 7.0, temp: 24 },
      { day: 'Sat', wqi: 78, pH: 7.8, DO: 7.8, temp: 27 },
      { day: 'Sun', wqi: 74, pH: 7.5, DO: 7.2, temp: 25 }
    ];
  }, [realData]);

  const parameterDistribution = useMemo(() => [
    { name: 'Good Quality', value: 45 },
    { name: 'Moderate', value: 30 },
    { name: 'Poor', value: 20 },
    { name: 'Critical', value: 5 }
  ], []);

  const monthlyData = useMemo(() => [
    { month: 'Jan', wqi: 65 },
    { month: 'Feb', wqi: 68 },
    { month: 'Mar', wqi: 71 },
    { month: 'Apr', wqi: 69 },
    { month: 'May', wqi: 73 },
    { month: 'Jun', wqi: 75 },
    { month: 'Jul', wqi: 72 },
    { month: 'Aug', wqi: 70 },
    { month: 'Sep', wqi: 76 },
    { month: 'Oct', wqi: 74 },
    { month: 'Nov', wqi: 77 },
    { month: 'Dec', wqi: 75 }
  ], []);

  const pollutionData = useMemo(() => {
    if (realData && realData.success && realData.location_data) {
      return realData.location_data.map(item => ({
        location: item.location,
        pollutionLevel: Math.round((item.avg_bod + item.avg_cod/5)),
        samples: item.samples,
        wqi: item.wqi,
        temperature: item.avg_temp,
        ph: item.avg_ph,
        do: item.avg_do,
        tds: item.avg_tds,
        bod: item.avg_bod,
        cod: item.avg_cod
      }));
    }
    
    // Fallback static data
    return [
      { location: 'Upstream', pollutionLevel: 35 },
      { location: 'Industrial Zone', pollutionLevel: 78 },
      { location: 'Residential Area', pollutionLevel: 52 },
      { location: 'Treatment Plant', pollutionLevel: 28 },
      { location: 'Downstream', pollutionLevel: 45 },
      { location: 'Estuary', pollutionLevel: 38 }
    ];
  }, [realData]);

  const getParameterColor = (index) => {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  };



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 overflow-hidden">
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🔍</span>
            <span className="font-semibold">DEMO MODE</span>
            <span className="text-sm">- Limited functionality. Register to unlock full features!</span>
            <Link to="/register" className="ml-4 bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
              Register Now
            </Link>
          </div>
        </div>
      )}

      {/* Data Source Indicator */}
      {!loading && (
        <div className={`text-center p-2 text-sm ${realData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <div className="flex items-center justify-center gap-2">
            <span>{realData ? '📊' : '⚠️'}</span>
            <span className="font-medium">
              {realData && realData.success ? 
                `Real Data: ${realData.data_source} (${realData.dataset_info?.total_records?.toLocaleString()} records, ${realData.dataset_info?.year_range}) - Updated: ${new Date(realData.timestamp).toLocaleTimeString()}` :
                'Using Static Demo Data - Real data not available'
              }
            </span>
            {error && <span className="text-red-600 ml-2">(API Error: {error})</span>}
          </div>
        </div>
      )}
      
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

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading Real Water Quality Data...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching from Mithi River Dataset</p>
          </div>
        </div>
      )}

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hover:animate-pulse" />
                
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

          {/* Mithi River Charts and Analysis Section */}
          <div className="space-y-8 mb-12">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Droplets className="text-blue-600 animate-pulse" size={36} />
                Mithi River Analysis Dashboard
                <Activity className="text-green-600 animate-bounce" size={36} />
              </h2>
              <p className="text-gray-600 text-lg">Real-time water quality trends and comprehensive analysis</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Water Quality Trends Chart */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp size={24} />
                    Water Quality Trends (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mithiTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="wqi" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pH" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="DO" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Water Quality Distribution */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Activity size={24} />
                    Parameter Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={parameterDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {parameterDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getParameterColor(index)} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Comparison Bar Chart */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp size={24} />
                    Monthly WQI Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="wqi" 
                        fill="url(#colorGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Area Chart for Pollution Levels */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle size={24} />
                    Pollution Level Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={pollutionData}>
                      <defs>
                        <linearGradient id="pollutionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="location" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="pollutionLevel" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#pollutionGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* River Health Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Overall Health Score",
                  value: "72/100",
                  status: "Moderate",
                  icon: CheckCircle,
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50",
                  gradient: "from-yellow-500 to-orange-500"
                },
                {
                  title: "Contamination Level",
                  value: "Medium",
                  status: "Requires Attention",
                  icon: AlertTriangle,
                  color: "text-orange-600",
                  bgColor: "bg-orange-50",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  title: "Biodiversity Index",
                  value: "6.8/10",
                  status: "Good Diversity",
                  icon: Activity,
                  color: "text-green-600",
                  bgColor: "bg-green-50",
                  gradient: "from-green-500 to-teal-500"
                },
                {
                  title: "Ecosystem Status",
                  value: "Stable",
                  status: "Improving Trend",
                  icon: TrendingUp,
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                  gradient: "from-blue-500 to-cyan-500"
                }
              ].map((metric, index) => (
                <Card key={metric.title} className="relative overflow-hidden shadow-lg border-0 bg-white/95 backdrop-blur-xl hover:scale-105 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5`} />
                  <CardContent className={`p-6 ${metric.bgColor} relative z-10`}>
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className={`${metric.color} animate-pulse`} size={32} />
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{metric.title}</h3>
                    <p className="text-sm text-gray-600">{metric.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                {demoMode ? (
                  <Button onClick={showDemoAlert} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    🚀 Launch ML Analytics
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    <Link to="/dashboard/ml-predictor">
                      🚀 Launch ML Analytics
                    </Link>
                  </Button>
                )}
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
                {demoMode ? (
                  <Button onClick={showDemoAlert} className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    🗺️ View Live Maps
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    <Link to="/dashboard/maps">
                      🗺️ View Live Maps
                    </Link>
                  </Button>
                )}
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
                {demoMode ? (
                  <Button onClick={showDemoAlert} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    🚀 Launch GIS System
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    <Link to="/dashboard/gis-mapping">
                      🚀 Launch GIS System
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mithi River Water Quality Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Real-time Water Quality Trends */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <span className="text-2xl animate-pulse">📈</span>
                  Mithi River - Real-time Quality Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { time: '00:00', pH: 7.1, DO: 6.8, temperature: 24.2 },
                    { time: '04:00', pH: 7.3, DO: 7.2, temperature: 23.8 },
                    { time: '08:00', pH: 6.9, DO: 7.5, temperature: 25.1 },
                    { time: '12:00', pH: 7.0, DO: 6.9, temperature: 26.5 },
                    { time: '16:00', pH: 7.2, DO: 7.1, temperature: 27.2 },
                    { time: '20:00', pH: 7.1, DO: 7.0, temperature: 25.8 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pH" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#1d4ed8' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="DO" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#059669' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#d97706' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">pH Level</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Dissolved Oxygen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Temperature (°C)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pollution Levels by Location */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🏭</span>
                  Pollution Levels by River Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { location: 'Upstream', BOD: 8.5, COD: 25.2, TSS: 15.8 },
                    { location: 'Midstream', BOD: 15.2, COD: 45.7, TSS: 28.4 },
                    { location: 'Industrial', BOD: 28.9, COD: 78.3, TSS: 42.1 },
                    { location: 'Downstream', BOD: 22.1, COD: 58.6, TSS: 35.7 },
                    { location: 'Estuary', BOD: 12.8, COD: 35.9, TSS: 22.3 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="location" 
                      stroke="#6b7280"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="BOD" 
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="COD" 
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="TSS" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">BOD (mg/L)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">COD (mg/L)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">TSS (mg/L)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Water Quality Index Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <span className="text-2xl animate-pulse">💧</span>
                  Mithi River WQI - 24 Hour Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { hour: '00:00', wqi: 78 }, { hour: '02:00', wqi: 82 }, { hour: '04:00', wqi: 85 },
                    { hour: '06:00', wqi: 79 }, { hour: '08:00', wqi: 73 }, { hour: '10:00', wqi: 68 },
                    { hour: '12:00', wqi: 71 }, { hour: '14:00', wqi: 75 }, { hour: '16:00', wqi: 80 },
                    { hour: '18:00', wqi: 83 }, { hour: '20:00', wqi: 86 }, { hour: '22:00', wqi: 81 }
                  ]}>
                    <defs>
                      <linearGradient id="wqiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value}`, 'WQI Score']}
                    />
                    <Area
                      type="monotone"
                      dataKey="wqi"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#wqiGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* River Health Summary */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <CardTitle className="text-lg flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🏥</span>
                  River Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    { parameter: "Overall Health", value: 78, color: "bg-green-500", status: "Good" },
                    { parameter: "Biodiversity", value: 65, color: "bg-yellow-500", status: "Fair" },
                    { parameter: "Chemical Balance", value: 82, color: "bg-green-500", status: "Good" },
                    { parameter: "Ecosystem Stability", value: 71, color: "bg-yellow-500", status: "Fair" }
                  ].map((item) => (
                    <div key={item.parameter} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.parameter}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">{item.status}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Latest Update</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Water quality improving steadily. Industrial discharge compliance at 85%. 
                    Monsoon season recovery on track.
                  </p>
                </div>
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
                  demoMode ? (
                    <Button
                      key={action.name}
                      onClick={showDemoAlert}
                      variant="outline"
                      className="h-20 flex flex-col gap-2 hover:scale-105 transition-all duration-300 border-2 hover:shadow-lg group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-8 h-8 ${action.color} text-white rounded-full flex items-center justify-center text-lg group-hover:animate-bounce`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  ) : (
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
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS Animations are handled by Tailwind CSS */}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
