import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Activity, 
  Waves, 
  Thermometer, 
  Droplets,
  Wind,
  Eye,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

const WaterQuality3D = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState('pH');
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef(null);

  // Mock 3D water quality data
  const waterQualityData = {
    pH: {
      current: 7.2,
      safe: [6.5, 8.5],
      color: '#3b82f6',
      trend: 'stable',
      data: Array.from({length: 20}, (_, i) => ({
        x: i * 5,
        y: Math.sin(i * 0.3) * 2 + 7.2,
        z: Math.cos(i * 0.2) * 1.5 + 5
      }))
    },
    DO: {
      current: 6.8,
      safe: [5.0, 14.0],
      color: '#10b981',
      trend: 'improving',
      data: Array.from({length: 20}, (_, i) => ({
        x: i * 5,
        y: Math.sin(i * 0.4) * 1.5 + 6.8,
        z: Math.cos(i * 0.3) * 2 + 4
      }))
    },
    BOD: {
      current: 3.2,
      safe: [0, 3.0],
      color: '#f59e0b',
      trend: 'critical',
      data: Array.from({length: 20}, (_, i) => ({
        x: i * 5,
        y: Math.sin(i * 0.5) * 1 + 3.2,
        z: Math.cos(i * 0.4) * 1.8 + 3
      }))
    },
    COD: {
      current: 25.5,
      safe: [0, 20.0],
      color: '#ef4444',
      trend: 'declining',
      data: Array.from({length: 20}, (_, i) => ({
        x: i * 5,
        y: Math.sin(i * 0.6) * 3 + 25.5,
        z: Math.cos(i * 0.5) * 2.2 + 6
      }))
    },
    Temperature: {
      current: 28.5,
      safe: [20, 35],
      color: '#8b5cf6',
      trend: 'stable',
      data: Array.from({length: 20}, (_, i) => ({
        x: i * 5,
        y: Math.sin(i * 0.35) * 2.5 + 28.5,
        z: Math.cos(i * 0.25) * 1.8 + 7
      }))
    }
  };

  // Animation loop
  useEffect(() => {
    let animationId;
    
    if (isAnimating) {
      const animate = () => {
        setCurrentTime(prev => prev + 0.02);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimating]);

  // 3D Visualization Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    const drawWaterWaves = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw animated water waves
      ctx.strokeStyle = waterQualityData[selectedParameter].color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const y = height/2 + 
            Math.sin((x + currentTime * 50 + i * 20) * 0.01) * (30 - i * 5) +
            Math.cos((x + currentTime * 30 + i * 15) * 0.008) * (20 - i * 3);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.globalAlpha -= 0.1;
      }
      
      // Draw data points
      const data = waterQualityData[selectedParameter].data;
      ctx.fillStyle = waterQualityData[selectedParameter].color;
      ctx.globalAlpha = 0.8;
      
      data.forEach((point, index) => {
        const x = (index / data.length) * width;
        const y = height - (point.y / 10) * height * 0.8;
        const size = 3 + Math.sin(currentTime * 2 + index) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = waterQualityData[selectedParameter].color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    
    drawWaterWaves();
  }, [currentTime, selectedParameter]);

  const getStatusColor = (parameter) => {
    const data = waterQualityData[parameter];
    const { current, safe, trend } = data;
    
    if (current >= safe[0] && current <= safe[1]) {
      return trend === 'improving' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <Activity className="h-4 w-4 text-green-600" />;
      case 'declining': return <Activity className="h-4 w-4 text-red-600 rotate-180" />;
      case 'critical': return <Activity className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="col-span-2 border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              3D Water Quality Visualization
            </CardTitle>
            <CardDescription className="text-gray-600">
              Real-time monitoring of Mithi River parameters with interactive 3D visualization
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="border-blue-200 hover:bg-blue-50"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTime(0)}
              className="border-blue-200 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Parameter Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(waterQualityData).map((param) => (
            <Button
              key={param}
              variant={selectedParameter === param ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedParameter(param)}
              className={`${
                selectedParameter === param 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0' 
                  : 'border-gray-200 hover:bg-gray-50'
              } transition-all duration-300`}
            >
              {param === 'pH' && <Droplets className="h-4 w-4 mr-1" />}
              {param === 'DO' && <Wind className="h-4 w-4 mr-1" />}
              {param === 'BOD' && <Activity className="h-4 w-4 mr-1" />}
              {param === 'COD' && <BarChart3 className="h-4 w-4 mr-1" />}
              {param === 'Temperature' && <Thermometer className="h-4 w-4 mr-1" />}
              {param}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Canvas Visualization */}
          <div className="lg:col-span-2">
            <div className="relative h-80 rounded-xl overflow-hidden border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: waterQualityData[selectedParameter].color }}
                  ></div>
                  <span className="font-medium text-gray-700">{selectedParameter}</span>
                  <Badge className={getStatusColor(selectedParameter)}>
                    {waterQualityData[selectedParameter].current} 
                    {selectedParameter === 'pH' ? '' : selectedParameter === 'Temperature' ? '°C' : ' mg/L'}
                  </Badge>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(waterQualityData[selectedParameter].trend)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {waterQualityData[selectedParameter].trend}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parameter Details */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                Current Reading
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-bold text-xl" style={{ color: waterQualityData[selectedParameter].color }}>
                    {waterQualityData[selectedParameter].current}
                    {selectedParameter === 'pH' ? '' : selectedParameter === 'Temperature' ? '°C' : ' mg/L'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(selectedParameter)}>
                    {waterQualityData[selectedParameter].current >= waterQualityData[selectedParameter].safe[0] && 
                     waterQualityData[selectedParameter].current <= waterQualityData[selectedParameter].safe[1] 
                      ? 'Normal' : 'Alert'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Safe Range:</span>
                  <span className="text-sm text-gray-500">
                    {waterQualityData[selectedParameter].safe[0]} - {waterQualityData[selectedParameter].safe[1]}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Waves className="h-4 w-4 mr-2 text-blue-600" />
                Live Statistics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-medium">{waterQualityData[selectedParameter].data.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trend:</span>
                  <span className="font-medium capitalize">{waterQualityData[selectedParameter].trend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Animation:</span>
                  <span className="font-medium">{isAnimating ? 'Active' : 'Paused'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Quick Insight</h4>
              <p className="text-sm text-gray-600">
                The 3D visualization shows real-time parameter fluctuations along the Mithi River. 
                Larger data points indicate higher concentrations, while the wave animation represents 
                temporal changes in water quality.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterQuality3D;