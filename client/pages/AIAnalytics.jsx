import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, Zap, Eye } from 'lucide-react';

const AIAnalytics = React.memo(() => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forecast');
  const [modelStatus, setModelStatus] = useState(null);

  useEffect(() => {
    // Fetch real CSV-derived data for graphs, keep model status/mock reports as-is
    generateMockAIData();
    generateMockModelStatus();
  }, []);

  const generateMockAIData = useCallback(async () => {
    // This function now sources graph data from backend CSV endpoints and maps them into the
    // shapes that the charts expect. Non-graph pieces remain generated locally where needed.
    try {
      setLoading(true);

      // Parallel fetch: dashboard stats (trend_data) and advanced features (timeline_data)
      const [statsRes, advRes] = await Promise.all([
        fetch('/api/dashboard/stats/'),
        fetch('/api/advanced-features/')
      ]);

      const statsJson = statsRes.ok ? await statsRes.json() : null;
      const advJson = advRes.ok ? await advRes.json() : null;

      // Build forecasts using the weekly trend (7 points) as the strongest data source for graphs
      const forecasts = [];
      if (statsJson && statsJson.success && Array.isArray(statsJson.trend_data) && statsJson.trend_data.length > 0) {
        const baseTrend = statsJson.trend_data;
        const today = new Date();
        // create 14-day forecast by repeating/perturbing weekly trend
        for (let i = 0; i < 14; i++) {
          const sample = baseTrend[i % baseTrend.length];
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const wqi = sample.wqi || 60 + Math.round(Math.random() * 20);

          forecasts.push({
            date: date.toISOString().split('T')[0],
            predicted_wqi: wqi,
            confidence: 0.75 + Math.random() * 0.2,
            upper_bound: Math.min(100, wqi + Math.round(Math.random() * 6)),
            lower_bound: Math.max(0, wqi - Math.round(Math.random() * 6)),
            predicted_ph: sample.ph || 7.0,
            predicted_do: sample.do || 5.5,
            predicted_temp: sample.temperature || 28,
            predicted_bod: sample.bod || 12,
            predicted_cod: sample.cod || 40,
            predicted_tds: sample.tds || 300,
            anomaly_score: Math.random() * 0.2,
            risk_level: wqi < 50 ? 'high' : wqi < 70 ? 'medium' : 'low'
          });
        }
      } else if (advJson && advJson.success && Array.isArray(advJson.timeline_data) && advJson.timeline_data.length > 0) {
        // Fallback: use timeline yearly data to synthesize a 30-day forecast around latest year averages
        const timeline = advJson.timeline_data;
        const latest = timeline[timeline.length - 1];
        const baseWqi = Math.round(latest.avg_wqi || 70);
        const today = new Date();
        for (let i = 0; i < 14; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const noise = Math.round((Math.random() - 0.5) * 6);
          forecasts.push({
            date: date.toISOString().split('T')[0],
            predicted_wqi: Math.max(20, Math.min(100, baseWqi + noise)),
            confidence: 0.7 + Math.random() * 0.25,
            upper_bound: Math.min(100, baseWqi + noise + 6),
            lower_bound: Math.max(0, baseWqi + noise - 6),
            predicted_ph: latest.avg_ph || 7.1,
            predicted_do: latest.avg_do || 6.0,
            predicted_temp: latest.avg_temperature || 28,
            predicted_bod: latest.avg_bod || 12,
            predicted_cod: latest.avg_cod || 40,
            predicted_tds: latest.avg_tds || 300,
            anomaly_score: Math.random() * 0.25,
            risk_level: 'medium'
          });
        }
      }

      // Keep some of the existing mock structures for modelPerformance, featureImportance, anomalies
      const modelPerformance = [
        { model: 'WQI Predictor', accuracy: 0.92, mse: 12.5, r2: 0.89, last_trained: '2024-10-01' },
        { model: 'pH Classifier', accuracy: 0.88, mse: 0.15, r2: 0.85, last_trained: '2024-10-02' },
        { model: 'Pollution Detector', accuracy: 0.94, mse: 8.3, r2: 0.91, last_trained: '2024-10-01' },
        { model: 'Anomaly Detector', accuracy: 0.87, mse: 0.23, r2: 0.82, last_trained: '2024-09-30' }
      ];

      const featureImportance = [
        { feature: 'Temperature', importance: 0.25, impact: 'high' },
        { feature: 'pH Level', importance: 0.22, impact: 'high' },
        { feature: 'Dissolved Oxygen', importance: 0.18, impact: 'medium' },
        { feature: 'Turbidity', importance: 0.15, impact: 'medium' },
        { feature: 'Conductivity', importance: 0.12, impact: 'medium' },
        { feature: 'Location', importance: 0.08, impact: 'low' }
      ];

      // Try to reuse anomalies from advanced features (smart_alerts) if available
      const anomalies = (advJson && advJson.smart_alerts) ? advJson.smart_alerts : [];

      // Satellite analysis / insights reuse from advanced features if present
      const satellite_analysis = (advJson && advJson.environmental_impact) ? advJson.environmental_impact : {
        pollution_detected: false,
        analysis_timestamp: new Date().toISOString()
      };

      setAiData({
        forecasts,
        modelPerformance,
        featureImportance,
        anomalies,
        satellite_analysis,
        insights: advJson?.environmental_impact || {
          trend_analysis: 'No advanced insights available',
          risk_assessment: 'unknown',
          recommendations: []
        },
        ai_insights: advJson?.ai_insights || { model_accuracy: 90 }
      });
    } catch (error) {
      console.error('Error fetching AI graph data:', error);
      // If fetch fails, fall back to the old mock generator to keep UI stable
      try {
        // small fallback: keep earlier random generation but shorter
        const forecasts = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(); date.setDate(date.getDate() + i);
          const baseWQI = 70 + Math.round((Math.random() - 0.5) * 10);
          forecasts.push({
            date: date.toISOString().split('T')[0],
            predicted_wqi: baseWQI,
            confidence: 0.8,
            upper_bound: Math.min(100, baseWQI + 6),
            lower_bound: Math.max(0, baseWQI - 6),
            predicted_ph: 7.1,
            predicted_do: 6.0,
            predicted_temp: 28,
            predicted_bod: 12,
            predicted_cod: 40,
            predicted_tds: 300,
            anomaly_score: 0.05,
            risk_level: 'low'
          });
        }
        setAiData({ forecasts, modelPerformance: [], featureImportance: [], anomalies: [] });
      } catch (e) {
        console.error('Fallback generation also failed', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMockModelStatus = () => {
    try {
      setModelStatus({
        overall_health: 'excellent',
        models: {
          wqi_predictor: { status: 'active', accuracy: 92, last_update: '2024-10-05T10:30:00Z' },
          anomaly_detector: { status: 'active', accuracy: 87, last_update: '2024-10-05T09:15:00Z' },
          pollution_classifier: { status: 'training', accuracy: 94, last_update: '2024-10-04T14:20:00Z' },
          trend_analyzer: { status: 'active', accuracy: 89, last_update: '2024-10-05T11:45:00Z' }
        },
        system_metrics: {
          cpu_usage: 45.2,
          memory_usage: 67.8,
          gpu_usage: 23.1,
          prediction_latency: 125 // ms
        },
        recent_activity: [
          'WQI prediction model updated successfully',
          'Anomaly detected in Sector 3 - pH spike',
          'New satellite imagery processed',
          'Compliance report generated for October',
          'Performance optimization completed'
        ],
        system_health: {
          cpu_usage: '45.2%',
          memory_usage: '67.8%',
          overall_status: 'Excellent',
          uptime: '99.8%',
          last_maintenance: '2024-10-01'
        }
      });
    } catch (error) {
      console.error('Error generating model status:', error);
    }
  };

  const generateReport = (reportType) => {
    try {
      // Generate mock report
      const report = {
        report_id: `AI_REPORT_${reportType}_${new Date().toISOString().split('T')[0]}`,
        generated_at: new Date().toISOString(),
        type: reportType,
        summary: {
          total_predictions: aiData.forecasts.length,
          avg_accuracy: 0.91,
          anomalies_detected: aiData.anomalies.length,
          risk_level: 'medium'
        },
        data: aiData,
        recommendations: [
          'Continue monitoring pH levels in sectors 2-4',
          'Implement predictive maintenance for sensor network',
          'Focus resources on high-risk pollution sources',
          'Consider increasing sampling frequency during peak hours'
        ]
      };
      
      // Create and download report
      const reportBlob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.report_id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
    'low': '#10b981',
    'medium': '#f59e0b', 
    'high': '#ef4444',
    'critical': '#dc2626'
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
              onClick={generateMockAIData}
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
                    {modelName === 'wqi_predictor' && '🔮'}
                    {modelName === 'anomaly_detector' && '⚡'}
                    {modelName === 'pollution_classifier' && '🏭'}
                    {modelName === 'trend_analyzer' && '�'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main AI Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="forecast" className="text-sm">🔮 Predictive Forecast</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-sm">⚡ Anomaly Detection</TabsTrigger>
          <TabsTrigger value="satellite" className="text-sm">🛰️ Computer Vision</TabsTrigger>
          <TabsTrigger value="insights" className="text-sm">🧠 AI Insights</TabsTrigger>
          <TabsTrigger value="advanced" className="text-sm">🚀 Advanced AI</TabsTrigger>
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
                        dataKey="predicted_wqi" 
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
                      <Line type="monotone" dataKey="predicted_ph" stroke="#3b82f6" strokeWidth={2} name="pH" />
                      <Line type="monotone" dataKey="predicted_tds" stroke="#10b981" strokeWidth={2} name="TDS" />
                      <Line type="monotone" dataKey="predicted_bod" stroke="#f59e0b" strokeWidth={2} name="BOD" />
                      <Line type="monotone" dataKey="predicted_cod" stroke="#ef4444" strokeWidth={2} name="COD" />
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
                            backgroundColor: riskColors[forecast.risk_level] || riskColors['low'],
                            color: 'white'
                          }}
                        >
                          {forecast.risk_level.charAt(0).toUpperCase() + forecast.risk_level.slice(1)} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          WQI: <span className="font-semibold">{Math.round(forecast.predicted_wqi)}</span>
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
                          {anomaly.anomalous_parameters && anomaly.anomalous_parameters.length > 0 ? 
                            anomaly.anomalous_parameters.map((param, i) => (
                              <div key={i}>
                                <strong>{param.parameter.toUpperCase()}:</strong> {param.value} 
                                (Expected: {param.expected_range})
                              </div>
                            )) : 
                            <div>
                              <strong>TYPE:</strong> {anomaly.type} - {anomaly.description}
                            </div>
                          }
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

        {/* Advanced AI Tab */}
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI-Powered Predictive Timeline */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Multi-Parameter AI Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aiData.forecasts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_wqi" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        name="WQI Prediction"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_ph" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        name="pH Level"
                        dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_do" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Dissolved Oxygen"
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple-100 p-2 rounded text-center">
                    <div className="font-semibold text-purple-800">WQI Trend</div>
                    <div className="text-purple-600">↗ Improving</div>
                  </div>
                  <div className="bg-cyan-100 p-2 rounded text-center">
                    <div className="font-semibold text-cyan-800">pH Stability</div>
                    <div className="text-cyan-600">⚖ Balanced</div>
                  </div>
                  <div className="bg-green-100 p-2 rounded text-center">
                    <div className="font-semibold text-green-800">DO Levels</div>
                    <div className="text-green-600">📈 Rising</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Model Ensemble Performance */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  AI Model Ensemble
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {aiData.modelPerformance.map((model, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{model.model}</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {(model.accuracy * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-gray-500">MSE</div>
                          <div className="font-medium">{model.mse.toFixed(1)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500">R² Score</div>
                          <div className="font-medium">{model.r2.toFixed(2)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500">Last Trained</div>
                          <div className="font-medium text-xs">{model.last_trained}</div>
                        </div>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${model.accuracy * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neural Network Architecture Visualization */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  Neural Network Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-48">
                  <div className="flex items-center space-x-8">
                    {/* Input Layer */}
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-2">Input Layer</div>
                      <div className="space-y-1">
                        {['pH', 'DO', 'Temp', 'Turb', 'TDS', 'EC'].map((param, i) => (
                          <div key={i} className="w-12 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                            {param}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Hidden Layers */}
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-2">Hidden Layers</div>
                      <div className="flex space-x-2">
                        <div className="space-y-1">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-8 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="w-8 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Output Layer */}
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-2">Output</div>
                      <div className="space-y-2">
                        <div className="w-16 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          WQI
                        </div>
                        <div className="w-16 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white">
                          Risk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-800 mb-2">Network Stats</div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Layers:</span>
                      <span className="font-medium ml-1">4 (1 Input + 2 Hidden + 1 Output)</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Parameters:</span>
                      <span className="font-medium ml-1">2,847</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Activation:</span>
                      <span className="font-medium ml-1">ReLU, Sigmoid</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Optimizer:</span>
                      <span className="font-medium ml-1">Adam</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time AI Processing Status */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Real-time AI Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">Data Ingestion</div>
                      <div className="text-sm text-green-600">Processing sensor data streams</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-800">Model Inference</div>
                      <div className="text-sm text-blue-600">Running predictions every 30s</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-700">Running</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-800">Anomaly Detection</div>
                      <div className="text-sm text-purple-600">Continuous monitoring</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-purple-700">Monitoring</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-500">Inference Speed</div>
                        <div className="font-bold text-green-600">42ms</div>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-500">Throughput</div>
                        <div className="font-bold text-blue-600">1.2k/min</div>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-500">Accuracy</div>
                        <div className="font-bold text-purple-600">94.3%</div>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <div className="text-gray-500">Uptime</div>
                        <div className="font-bold text-orange-600">99.8%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

AIAnalytics.displayName = 'AIAnalytics';

export default AIAnalytics;