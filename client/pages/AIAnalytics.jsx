import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AIAnalytics = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forecast');
  const [modelStatus, setModelStatus] = useState(null);

  useEffect(() => {
    fetchAIData();
    fetchModelStatus();
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/dashboard/');
      const result = await response.json();
      
      if (result.success) {
        setAiData(result.data);
      }
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelStatus = async () => {
    try {
      const response = await fetch('/api/ai/status/');
      const result = await response.json();
      
      if (result.success) {
        setModelStatus(result.status);
      }
    } catch (error) {
      console.error('Error fetching model status:', error);
    }
  };

  const generateReport = async (reportType) => {
    try {
      const response = await fetch('/api/ai/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reportType,
          data: aiData
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Create and download report
        const reportBlob = new Blob([JSON.stringify(result.report, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(reportBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.report.report_id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading AI Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const riskColors = {
    'Low': '#10b981',
    'Moderate': '#f59e0b', 
    'High': '#ef4444',
    'Critical': '#dc2626'
  };

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 AI-Powered Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Advanced artificial intelligence for water quality prediction, anomaly detection, and environmental insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => generateReport('daily')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              📊 Generate Report
            </Button>
            <Button 
              onClick={fetchAIData}
              variant="outline"
            >
              🔄 Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* AI System Status */}
      {modelStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(modelStatus.models).map(([modelName, model]) => (
            <Card key={modelName} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 capitalize">
                  {modelName.replace('_', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {model.accuracy ? `${model.accuracy}%` : 'Active'}
                    </div>
                    <Badge 
                      variant={model.status === 'active' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <div className="text-3xl">
                    {modelName === 'predictive_analytics' && '🔮'}
                    {modelName === 'anomaly_detection' && '⚡'}
                    {modelName === 'computer_vision' && '👁️'}
                    {modelName === 'nlp_reports' && '📝'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main AI Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="forecast" className="text-sm">🔮 Predictive Forecast</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-sm">⚡ Anomaly Detection</TabsTrigger>
          <TabsTrigger value="satellite" className="text-sm">🛰️ Computer Vision</TabsTrigger>
          <TabsTrigger value="insights" className="text-sm">🧠 AI Insights</TabsTrigger>
        </TabsList>

        {/* Predictive Forecast Tab */}
        <TabsContent value="forecast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day WQI Forecast */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Water Quality Index Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {aiData?.forecasts && (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={aiData.forecasts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        formatter={(value, name) => [value, 'WQI']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="wqi" 
                        stroke="#8b5cf6" 
                        fill="url(#colorWqi)" 
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="colorWqi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Parameter Predictions */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧪</span>
                  Parameter Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {aiData?.forecasts && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={aiData.forecasts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                      <Legend />
                      <Line type="monotone" dataKey="predictions.ph" stroke="#3b82f6" strokeWidth={2} name="pH" />
                      <Line type="monotone" dataKey="predictions.tds" stroke="#10b981" strokeWidth={2} name="TDS" />
                      <Line type="monotone" dataKey="predictions.bod" stroke="#f59e0b" strokeWidth={2} name="BOD" />
                      <Line type="monotone" dataKey="predictions.cod" stroke="#ef4444" strokeWidth={2} name="COD" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Risk Assessment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {aiData?.forecasts?.map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-600">
                          {new Date(forecast.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <Badge 
                          style={{ 
                            backgroundColor: riskColors[forecast.risk_level.level],
                            color: 'white'
                          }}
                        >
                          {forecast.risk_level.level} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          WQI: <span className="font-semibold">{forecast.wqi}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Confidence: <span className="font-semibold">{(forecast.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Anomaly Detection Tab */}
        <TabsContent value="anomalies">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anomaly Alerts */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  Active Anomaly Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {aiData?.anomalies?.length > 0 ? (
                  <div className="space-y-4">
                    {aiData.anomalies.map((anomaly, index) => (
                      <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-red-800">{anomaly.location}</div>
                          <Badge variant="destructive">{anomaly.severity}</Badge>
                        </div>
                        <div className="text-sm text-red-700 space-y-1">
                          {anomaly.anomalous_parameters.map((param, i) => (
                            <div key={i}>
                              <strong>{param.parameter.toUpperCase()}:</strong> {param.value} 
                              (Expected: {param.expected_range})
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-red-600">
                          Anomaly Score: {anomaly.anomaly_score}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <div className="text-gray-600">No anomalies detected</div>
                    <div className="text-sm text-gray-500 mt-2">All parameters within normal ranges</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Anomaly Statistics */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Detection Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{aiData?.ai_insights?.anomalies_detected || 0}</div>
                    <div className="text-sm text-gray-600">Anomalies Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{aiData?.ai_insights?.model_accuracy || 0}%</div>
                    <div className="text-sm text-gray-600">Detection Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {((aiData?.ai_insights?.confidence_score || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-2">AI Model Performance</div>
                  <div className="space-y-2 text-xs text-blue-700">
                    <div>• Isolation Forest algorithm for outlier detection</div>
                    <div>• Real-time analysis of pH, TDS, BOD, COD parameters</div>
                    <div>• Automatic alert generation for critical anomalies</div>
                    <div>• Self-learning model adapts to seasonal patterns</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Computer Vision Tab */}
        <TabsContent value="satellite">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Satellite Analysis Results */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🛰️</span>
                  Satellite Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {aiData?.satellite_analysis && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium">Analysis Status</div>
                      <Badge variant={aiData.satellite_analysis.pollution_detected ? "destructive" : "default"}>
                        {aiData.satellite_analysis.pollution_detected ? "Pollution Detected" : "Clean"}
                      </Badge>
                    </div>
                    
                    {aiData.satellite_analysis.pollution_types?.map((pollution, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold capitalize">{pollution.type.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-600">{(pollution.confidence * 100).toFixed(1)}% confidence</div>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">{pollution.description}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div>Area: {pollution.area_percentage}%</div>
                          <Badge variant={pollution.severity === 'high' ? 'destructive' : 'secondary'}>
                            {pollution.severity} severity
                          </Badge>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800 mb-2">Computer Vision Capabilities</div>
                      <div className="space-y-1 text-xs text-green-700">
                        <div>• Algae bloom detection and tracking</div>
                        <div>• Oil spill identification</div>
                        <div>• Sediment plume analysis</div>
                        <div>• Water temperature mapping</div>
                        <div>• Turbidity level assessment</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Water Quality Indicators */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌊</span>
                  Water Quality Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {aiData?.satellite_analysis?.water_quality_indicators && (
                  <div className="space-y-4">
                    {Object.entries(aiData.satellite_analysis.water_quality_indicators).map(([indicator, level]) => (
                      <div key={indicator} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="text-sm font-medium capitalize">
                          {indicator.replace('_', ' ')}
                        </div>
                        <Badge 
                          variant={level === 'elevated' || level === 'high' ? 'destructive' : 'default'}
                        >
                          {level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-800 mb-3">Recommended Actions</div>
                  {aiData?.satellite_analysis?.recommended_actions?.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="text-sm text-gray-700">{action}</div>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => {
                    // Simulate requesting new satellite analysis
                    alert('New satellite analysis requested. Results will be available in 15-30 minutes.');
                  }}
                >
                  🛰️ Request New Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Performance Metrics */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">
                      {aiData?.ai_insights?.model_accuracy}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Accuracy</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {aiData?.ai_insights?.total_predictions}
                      </div>
                      <div className="text-xs text-gray-600">Predictions Made</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {((aiData?.ai_insights?.confidence_score || 0) * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600">Confidence</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-50 rounded">
                    <div className="text-xs font-medium text-purple-800">Model Capabilities</div>
                    <div className="text-xs text-purple-700 mt-1 space-y-1">
                      <div>• 7-day pollution forecasting</div>
                      <div>• Real-time anomaly detection</div>
                      <div>• Satellite image analysis</div>
                      <div>• Automated report generation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent AI Activity */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {modelStatus?.recent_activity && (
                  <div className="space-y-3">
                    {modelStatus.recent_activity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div className="text-sm text-gray-700">{activity}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-indigo-50 rounded">
                  <div className="text-xs font-medium text-indigo-800">System Health</div>
                  {modelStatus?.system_health && (
                    <div className="text-xs text-indigo-700 mt-1 space-y-1">
                      <div>CPU: {modelStatus.system_health.cpu_usage}</div>
                      <div>Memory: {modelStatus.system_health.memory_usage}</div>
                      <div>Status: {modelStatus.system_health.overall_status}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Reports */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  AI Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button 
                    onClick={() => generateReport('daily')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  >
                    📊 Daily Assessment
                  </Button>
                  <Button 
                    onClick={() => generateReport('forecast')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    🔮 Forecast Report
                  </Button>
                  <Button 
                    onClick={() => generateReport('compliance')}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white"
                  >
                    ✅ Compliance Report
                  </Button>
                  <Button 
                    onClick={() => generateReport('incident')}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white"
                  >
                    🚨 Incident Analysis
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-teal-50 rounded">
                  <div className="text-xs font-medium text-teal-800">Report Features</div>
                  <div className="text-xs text-teal-700 mt-1 space-y-1">
                    <div>• Natural language summaries</div>
                    <div>• Regulatory compliance analysis</div>
                    <div>• Environmental impact assessment</div>
                    <div>• Actionable recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalytics;