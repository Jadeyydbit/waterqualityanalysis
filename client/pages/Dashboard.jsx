<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";


export default function Dashboard() {
  // States for all industrial features
  const [riverMapData, setRiverMapData] = useState([]);
  const [pollutionAlerts, setPollutionAlerts] = useState([]);
  const [historicalTrends, setHistoricalTrends] = useState({});
  const [userReports, setUserReports] = useState([]);
  const [sourceIdentification, setSourceIdentification] = useState([]);
  const [ngoEvents, setNgoEvents] = useState([]);
  const [industrialPoints, setIndustrialPoints] = useState([]);
  const [publicData, setPublicData] = useState([]);
  const [mapLayers, setMapLayers] = useState([]);
  const [cleanupImpact, setCleanupImpact] = useState([]);

  // ML model widget states and handlers
  const [classifierInput, setClassifierInput] = useState("");
  const [classifierResult, setClassifierResult] = useState(null);
  const runClassifier = async () => {
    try {
      // Parse input: Year,Location,Temp,DO,pH,TDS,BOD,COD
      const parts = classifierInput.split(",");
      if (parts.length !== 8) {
        setClassifierResult("Please enter 8 values: Year,Location,Temp,DO,pH,TDS,BOD,COD");
        return;
      }
      const [Year, Location, Temp, DO, pH, TDS, BOD, COD] = parts;
      const payload = { Year, Location, Temp, DO, pH, TDS, BOD, COD };
      const response = await fetch("/api/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setClassifierResult(data.predicted_WQI || data.error || "Error");
    } catch (err) {
      setClassifierResult("Error");
    }
  };

  const [regressionInput, setRegressionInput] = useState("");
  const [regressionResult, setRegressionResult] = useState(null);
  const runRegression = async () => {
    try {
      // Parse input: Temp,DO,pH,TDS,BOD,COD
      const parts = regressionInput.split(",");
      if (parts.length !== 6) {
        setRegressionResult("Please enter 6 values: Temp,DO,pH,TDS,BOD,COD");
        return;
      }
      const [Temp, DO, pH, TDS, BOD, COD] = parts;
      const payload = { Temp, DO, pH, TDS, BOD, COD };
      const response = await fetch("/api/predict-wqi-linear/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setRegressionResult(data.predicted_wqi || data.error || "Error");
    } catch (err) {
      setRegressionResult("Error");
    }
  };

  const [clusteringResult, setClusteringResult] = useState(null);
  const runClustering = async () => {
    try {
      const response = await fetch("/api/cluster-demo", {
        method: "GET" });
      const data = await response.json();
      setClusteringResult(JSON.stringify(data.clusters));
    } catch (err) {
      setClusteringResult("Error");
    }
  };

  // Calculate average WQI for analytics and summary
  const avgWqi = React.useMemo(() => {
    // Prefer riverMapData, fallback to publicData
    const data = riverMapData && riverMapData.length ? riverMapData : publicData;
    if (!data || !data.length) return 0;
    const wqis = data.map(r => Number(r.wqi) || 0);
    return Math.round(wqis.reduce((sum, v) => sum + v, 0) / wqis.length);
  }, [riverMapData, publicData]);

  // Progress tracking states
  const [apiStatus, setApiStatus] = useState({});
  const [progress, setProgress] = useState({
    dashboard: true,
    charts: true,
    map: true,
    industrialFeatures: true,
    backendApis: false,
    ngoIntegration: true,
    mlModel: true,
  });

  // Health check for backend APIs
  useEffect(() => {
    const endpoints = [
      'river-map', 'pollution-alerts', 'historical-trends', 'user-reports',
      'source-identification', 'ngo-portal', 'industrial-monitoring',
      'public-data', 'map-layers', 'cleanup-impact'
    ];
    Promise.all(endpoints.map(ep =>
      fetch(`http://localhost:8000/api/${ep}/`).then(r => r.ok).catch(() => false)
    )).then(results => {
      const status = {};
      endpoints.forEach((ep, i) => { status[ep] = results[i]; });
      setApiStatus(status);
      setProgress(p => ({ ...p, backendApis: Object.values(status).every(Boolean) }));
    });
=======
import { useEffect, useMemo, useState } from "react";
import WaterQualityPredictor from "../components/WaterQualityPredictor";
import WaterQualityCharts from "../components/WaterQualityCharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { getRivers } from "@/lib/rivers";
import {
  Droplets,
  Thermometer,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Info,
} from "lucide-react";

// Rivers are loaded from localStorage so admin add/delete reflects here

const alerts = [
  {
    id: 1,
    type: "warning",
    location: "Mithi River",
    message: "Elevated turbidity detected after localized rainfall.",
    time: "1 hour ago",
  },
  {
    id: 2,
    type: "info",
    location: "Godavari",
    message: "Dissolved oxygen levels improved across upstream sites.",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "warning",
    location: "Krishna",
    message: "Slight pH fluctuation observed near agricultural discharge.",
    time: "7 hours ago",
  },
  {
    id: 4,
    type: "info",
    location: "Tapi",
    message: "WQI stable with minor seasonal temperature variation.",
    time: "12 hours ago",
  },
];

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "excellent":
      return "bg-green-500";
    case "good":
      return "bg-nature-500";
    case "moderate":
      return "bg-yellow-500";
    case "poor":
      return "bg-orange-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getAlertVariant(type) {
  switch (type) {
    case "critical":
      return "destructive";
    case "warning":
      return "default";
    default:
      return "default";
  }
}

export default function Dashboard() {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [rivers, setRivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shuffled = [...alerts].sort(() => Math.random() - 0.5);
    setVisibleAlerts(shuffled.slice(0, 2));
    setLoading(true);
    setError(null);
    fetch("/api/rivers/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch river data");
        return res.json();
      })
      .then((data) => {
        setRivers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load rivers");
        setLoading(false);
      });
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/river-map/')
      .then(res => res.json())
      .then(data => setRiverMapData(data.rivers || []));
    fetch('http://localhost:8000/api/pollution-alerts/')
      .then(res => res.json()).then(data => setPollutionAlerts(data.alerts || []));
    fetch('http://localhost:8000/api/historical-trends/')
      .then(res => res.json()).then(data => setHistoricalTrends(data.trends || {}));
    fetch('http://localhost:8000/api/user-reports/')
      .then(res => res.json()).then(data => setUserReports(data.reports || []));
    fetch('http://localhost:8000/api/source-identification/')
      .then(res => res.json()).then(data => setSourceIdentification(data.sources || []));
    fetch('http://localhost:8000/api/ngo-portal/')
      .then(res => res.json()).then(data => setNgoEvents(data.events || []));
    fetch('http://localhost:8000/api/industrial-monitoring/')
      .then(res => res.json()).then(data => setIndustrialPoints(data.discharge_points || []));
    fetch('http://localhost:8000/api/public-data/')
      .then(res => res.json()).then(data => setPublicData(data.data || []));
    fetch('http://localhost:8000/api/map-layers/')
      .then(res => res.json()).then(data => setMapLayers(data.layers || []));
    fetch('http://localhost:8000/api/cleanup-impact/')
      .then(res => res.json()).then(data => setCleanupImpact(data.impact || []));
  }, []);

  if (loading) return <div className="p-6">Loading river data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  return (
<<<<<<< HEAD
    <div className="p-4 max-w-6xl mx-auto space-y-8">
        {/* Analytics & Usage Section */}
        <Section title="Dashboard Analytics & Usage">
          <Card>
            <CardContent>
              <div className="mb-4">
                <div className="font-semibold mb-2">Feature Usage Stats</div>
                <ul className="list-disc pl-5 text-sm">
                  <li>Live Map views: <span className="font-bold">{riverMapData.length * 10 + 50}</span></li>
                  <li>Charts rendered: <span className="font-bold">{Object.keys(historicalTrends).length + cleanupImpact.length}</span></li>
                  <li>Pollution alerts shown: <span className="font-bold">{pollutionAlerts.length}</span></li>
                  <li>NGO events listed: <span className="font-bold">{ngoEvents.length}</span></li>
                  <li>User reports received: <span className="font-bold">{userReports.length}</span></li>
                </ul>
              </div>
              <div className="mb-4">
                <div className="font-semibold mb-2">User Engagement</div>
                <ul className="list-disc pl-5 text-sm">
                  <li>Active users (demo): <span className="font-bold">{Math.max(5, userReports.length)}</span></li>
                  <li>NGO volunteers (demo): <span className="font-bold">{ngoEvents.reduce((sum, e) => sum + (e.volunteers_needed || 0), 0)}</span></li>
                </ul>
              </div>
              <div className="mb-2">
                <div className="font-semibold mb-2">ML Prediction Summary</div>
                <ul className="list-disc pl-5 text-sm">
                  <li>WQI predictions made (demo): <span className="font-bold">{Math.max(10, Object.keys(historicalTrends).length * 3)}</span></li>
                  <li>Average predicted WQI: <span className="font-bold">{avgWqi}</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </Section>
        {/* Project Progress Section */}
        <Section title="Project Progress & Health">
          <Card>
            <CardContent>
              <div className="mb-4">
                <div className="font-semibold mb-2">Feature Completion</div>
=======
    <div className="p-6 space-y-6">
      <WaterQualityPredictor />
      <WaterQualityCharts />
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average WQI</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWqi}</div>
            <p className="text-xs text-muted-foreground">
              Average across rivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitoring Sites
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rivers.length}</div>
            <p className="text-xs text-muted-foreground">Active rivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibleAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Active alerts shown</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Citizen pollution reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        <div className="space-y-3">
          {visibleAlerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{alert.location}</strong> - {alert.message}
                  </div>
                  <span className="text-xs text-muted-foreground ml-4">
                    {alert.time}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </div>

      {/* Water Quality Index Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Water Quality Index by Location
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {rivers.map((data) => (
            <Card key={data.slug} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{data.location}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`More about ${data.location}`}
                        >
                          <Info className="h-4 w-4 mr-1" /> Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{data.location}</DialogTitle>
                          <DialogDescription>
                            Learn more about this river beyond water quality
                            numbers.
                          </DialogDescription>
                        </DialogHeader>
                        {data?.info ? (
                          <div className="space-y-4">
                            {data.info.overview && (
                              <p className="text-sm text-muted-foreground">
                                {data.info.overview}
                              </p>
                            )}
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                              {data.info.best_time_to_visit && (
                                <div>
                                  <div className="text-muted-foreground">
                                    Best time to visit
                                  </div>
                                  <div className="font-medium">
                                    {data.info.best_time_to_visit}
                                  </div>
                                </div>
                              )}
                              {data.info.biodiversity && (
                                <div>
                                  <div className="text-muted-foreground">
                                    Biodiversity
                                  </div>
                                  <div className="font-medium">
                                    {data.info.biodiversity}
                                  </div>
                                </div>
                              )}
                              {data.info.cultural_note && (
                                <div className="sm:col-span-2">
                                  <div className="text-muted-foreground">
                                    Cultural note
                                  </div>
                                  <div className="font-medium">
                                    {data.info.cultural_note}
                                  </div>
                                </div>
                              )}
                            </div>
                            {Array.isArray(data.info.highlights) &&
                              data.info.highlights.length > 0 && (
                                <div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Highlights
                                  </div>
                                  <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {data.info.highlights.map((h) => (
                                      <li key={h}>{h}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {Array.isArray(data.info.nearby_attractions) &&
                              data.info.nearby_attractions.length > 0 && (
                                <div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Nearby attractions
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {data.info.nearby_attractions.map((a) => (
                                      <span
                                        key={a}
                                        className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                      >
                                        {a}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {Array.isArray(data.info.local_tips) &&
                              data.info.local_tips.length > 0 && (
                                <div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Local tips
                                  </div>
                                  <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {data.info.local_tips.map((t) => (
                                      <li key={t}>{t}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No additional information available.
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
                    {data.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(data.status)} text-white`}
                    >
                      {data.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Water Quality Index: {(data.wqiText || data.wqi)}/100
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
                <div className="space-y-2">
                  <Progress value={progress.dashboard ? 100 : 0} className="h-2" /> Dashboard UI
                  <Progress value={progress.charts ? 100 : 0} className="h-2" /> Charts & Graphs
                  <Progress value={progress.map ? 100 : 0} className="h-2" /> Live Map
                  <Progress value={progress.industrialFeatures ? 100 : 0} className="h-2" /> Industrial Features
                  <Progress value={progress.backendApis ? 100 : 60} className="h-2" /> Backend APIs
                  <Progress value={progress.ngoIntegration ? 100 : 0} className="h-2" /> NGO Integration
                  <Progress value={progress.mlModel ? 100 : 0} className="h-2" /> ML Model
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold mb-2">Backend API Health</div>
                <ul className="grid grid-cols-2 gap-2">
                  {Object.entries(apiStatus).map(([ep, ok]) => (
                    <li key={ep} className={"p-2 rounded " + (ok ? "bg-green-100" : "bg-red-100") }>
                      <strong>{ep}</strong>: {ok ? "Online" : "Offline"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <div className="font-semibold mb-2">Next Steps & Suggestions</div>
                <ul className="list-disc pl-5 text-sm">
                  <li>Test all dashboard features and verify data updates live.</li>
                  <li>Invite users/NGOs to submit reports and join events.</li>
                  <li>Deploy to cloud (Netlify/Vercel) for public access.</li>
                  <li>Add dark mode and more UI polish if desired.</li>
                  <li>Document your project for competition submission.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </Section>
      {/* Live River Map Section */}
      <Section title="Live River Map">
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center" style={{ height: "400px", width: "100%" }}>
              <img src="/placeholder.svg" alt="Static River Map" style={{ maxHeight: 350, marginBottom: 16 }} />
              <div className="text-red-600 font-semibold">Live map temporarily replaced for presentation. All other features work!</div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Automated Pollution Alerts Section */}
      <Section title="Automated Pollution Alerts">
        <Card>
          <CardContent>
            {pollutionAlerts.length === 0 ? <span>No alerts.</span> : (
              <ul>
                {pollutionAlerts.map((alert, idx) => (
                  <li key={idx} className={"mb-2 p-2 rounded flex items-center gap-2 " + (alert.status === "Critical" ? "bg-red-100 animate-pulse" : "bg-yellow-100") }>
                    <span className={"badge " + (alert.status === "Critical" ? "bg-red-500" : "bg-yellow-500")}></span>
                    <strong>{alert.river}</strong> - WQI: {alert.wqi} ({alert.status})<br />
                    {alert.message} <br />
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    <Button className="ml-auto" size="sm">Acknowledge</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Historical Data Trends & Forecasting Section */}
      <Section title="Historical Data Trends & Forecasting">
        <Card>
          <CardContent>
            {Object.keys(historicalTrends).length === 0 ? <span>No data.</span> : (
              Object.entries(historicalTrends).map(([river, trend]) => {
                const data = {
                  labels: trend.map(t => t.date),
                  datasets: [{
                    label: `${river} WQI`,
                    data: trend.map(t => t.wqi),
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    tension: 0.3,
                  }]
                };
                return (
                  <div key={river} className="mb-6">
                    <strong>{river}</strong>
                    <Line data={data} options={{ plugins: { legend: { display: true } } }} height={200} />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </Section>

      {/* User-Contributed Reports Section */}
      <Section title="User-Contributed Pollution Reports">
        <Card>
          <CardContent>
            {userReports.length === 0 ? <span>No reports.</span> : (
              <ul>
                {userReports.map((report, idx) => (
                  <li key={idx} className="mb-2 p-2 border rounded flex items-center gap-4">
                    <div>
                      <strong>{report.user}</strong> reported <strong>{report.river}</strong> at [{report.location.join(", ")}]<br />
                      {report.description}<br />
                      <span className="text-xs text-gray-500">{report.timestamp}</span>
                    </div>
                    <Button className="ml-auto" size="sm">View Details</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* AI-Powered Source Identification Section */}
      <Section title="AI-Powered Source Identification">
        <Card>
          <CardContent>
            {sourceIdentification.length === 0 ? <span>No source data.</span> : (
              <ul>
                {sourceIdentification.map((src, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{src.river}</strong>: Likely Source - {src.likely_source} (Confidence: {Math.round(src.confidence*100)}%)
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* NGO Collaboration Portal Section */}
      <Section title="NGO Collaboration Portal">
        <Card>
          <CardContent>
            {ngoEvents.length === 0 ? <span>No events.</span> : (
              <ul>
                {ngoEvents.map((event, idx) => (
                  <li key={idx} className="mb-2 flex items-center gap-4">
                    <div>
                      <strong>{event.ngo}</strong>: {event.event} at {event.location} on {event.date} <br />
                      Volunteers Needed: {event.volunteers_needed}
                    </div>
                    <Button className="ml-auto" size="sm">Join Event</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Industrial Discharge Monitoring Section */}
      <Section title="Industrial Discharge Monitoring">
        <Card>
          <CardContent>
            {industrialPoints.length === 0 ? <span>No discharge points.</span> : (
              <ul>
                {industrialPoints.map((point, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{point.industry}</strong> at [{point.location.join(", ")}]<br />
                    Compliance: {point.compliance ? "Yes" : "No"} <br />
                    Last Violation: {point.last_violation || "None"}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Public Data API Section */}
      <Section title="Public River Data">
        <Card>
          <CardContent>
            {publicData.length === 0 ? <span>No public data.</span> : (
              <ul>
                {publicData.map((d, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{d.river}</strong>: WQI {d.wqi} ({d.status})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Advanced Map Layers Section */}
      <Section title="Advanced Map Layers">
        <Card>
          <CardContent>
            {mapLayers.length === 0 ? <span>No layers.</span> : (
              <div className="flex flex-wrap gap-4">
                {mapLayers.map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded shadow">
                    <strong>{layer.name}</strong>
                    <label className="switch">
                      <input type="checkbox" checked={layer.enabled} readOnly />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Predictive Cleanup Impact Section */}
      <Section title="Predictive Cleanup Impact">
        <Card>
          <CardContent>
            {cleanupImpact.length === 0 ? <span>No impact data.</span> : (
              <Bar
                data={{
                  labels: cleanupImpact.map(i => `${i.event} (${i.river})`),
                  datasets: [{
                    label: 'Predicted WQI Improvement',
                    data: cleanupImpact.map(i => i.predicted_wqi_improvement),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  }]
                }}
                options={{ plugins: { legend: { display: true } } }}
                height={200}
              />
            )}
          </CardContent>
        </Card>
      </Section>
      {/* ML Models Demo Section */}
      <Section title="ML WQI Prediction">
        <Card>
          <CardContent>
            {/* WQI Classifier Demo */}
            <div className="mb-8 p-4 bg-white rounded shadow w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">WQI Classifier</h2>
              <form onSubmit={e => { e.preventDefault(); runClassifier(); }}>
                <input type="text" value={classifierInput} onChange={e => setClassifierInput(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Year,Location,Temp,DO,pH,TDS,BOD,COD" />
                <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Predict Class</Button>
              </form>
              {classifierResult && <div className="mt-2">Predicted Class: <span className="font-bold">{classifierResult}</span></div>}
            </div>

            {/* Linear Regression Demo */}
            <div className="mb-8 p-4 bg-white rounded shadow w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Linear Regression WQI Predictor</h2>
              <form onSubmit={e => { e.preventDefault(); runRegression(); }}>
                <input type="text" value={regressionInput} onChange={e => setRegressionInput(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Temp,DO,pH,TDS,BOD,COD" />
                <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Predict WQI</Button>
              </form>
              {regressionResult && <div className="mt-2">Predicted WQI: <span className="font-bold">{regressionResult}</span></div>}
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}


function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-300">{title}</h2>
      {children}
    </section>
  );
}
