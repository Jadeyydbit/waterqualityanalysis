import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Droplets,
  Thermometer,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock
} from "lucide-react";

const waterQualityData = [
  {
    id: 1,
    slug: "mithi",
    location: "Mithi River",
    wqi: 48,
    status: "Moderate",
    ph: 7.1,
    oxygen: 4.5,
    temperature: 27,
    turbidity: 62,
    trend: "down"
  },
  {
    id: 2,
    slug: "godavari",
    location: "Godavari",
    wqi: 72,
    status: "Good",
    ph: 7.4,
    oxygen: 7.9,
    temperature: 25,
    turbidity: 30,
    trend: "up"
  },
  {
    id: 3,
    slug: "krishna",
    location: "Krishna",
    wqi: 66,
    status: "Moderate",
    ph: 7.0,
    oxygen: 6.2,
    temperature: 24,
    turbidity: 40,
    trend: "up"
  },
  {
    id: 4,
    slug: "tapi",
    location: "Tapi",
    wqi: 58,
    status: "Moderate",
    ph: 7.3,
    oxygen: 5.6,
    temperature: 26,
    turbidity: 50,
    trend: "down"
  }
];

const alerts = [
  {
    id: 1,
    type: "critical",
    location: "Yamuna River - Delhi",
    message: "High pollution levels detected. Industrial waste suspected.",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "warning",
    location: "Ganges River - Haridwar",
    message: "Increased turbidity levels after heavy rainfall.",
    time: "6 hours ago"
  },
  {
    id: 3,
    type: "info",
    location: "Narmada River - Bhopal",
    message: "Water quality improved after cleanup drive.",
    time: "1 day ago"
  }
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
  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average WQI
            </CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57.5</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Active monitoring locations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reports Today
            </CardTitle>
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
          {alerts.map((alert) => (
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
        <h2 className="text-lg font-semibold">Water Quality Index by Location</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {waterQualityData.map((data) => (
            <Card key={data.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{data.location}</CardTitle>
                  <div className="flex items-center space-x-2">
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
                  Water Quality Index: {data.wqi}/100
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>WQI Score</span>
                    <span>{data.wqi}/100</span>
                  </div>
                  <Progress value={data.wqi} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-muted-foreground">pH Level</div>
                      <div className="font-medium">{data.ph}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-muted-foreground">Oxygen (mg/L)</div>
                      <div className="font-medium">{data.oxygen}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-muted-foreground">Temperature (°C)</div>
                      <div className="font-medium">{data.temperature}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="text-muted-foreground">Turbidity (NTU)</div>
                      <div className="font-medium">{data.turbidity}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button size="sm" asChild>
                    <Link to={`/dashboard/rivers/${data.slug}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
