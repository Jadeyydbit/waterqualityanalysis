import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Droplets, Thermometer, AlertTriangle, Zap, ArrowLeft } from "lucide-react";

const RIVER_DATA = [
  {
    slug: "mithi",
    name: "Mithi River",
    description: "An urban river in Mumbai facing industrial and domestic pollution challenges.",
    wqi: 48,
    status: "Moderate",
    ph: 7.1,
    oxygen: 4.5,
    temperature: 27,
    turbidity: 62,
    trend: "down",
    locations: ["Bandra Kurla Complex", "Andheri", "Kurla"]
  },
  {
    slug: "godavari",
    name: "Godavari",
    description: "One of India's longest rivers, crucial for irrigation and drinking water across multiple states.",
    wqi: 72,
    status: "Good",
    ph: 7.4,
    oxygen: 7.9,
    temperature: 25,
    turbidity: 30,
    trend: "up",
    locations: ["Nashik", "Nanded", "Rajahmundry"]
  },
  {
    slug: "krishna",
    name: "Krishna",
    description: "A major river in southern India supporting agriculture and hydropower.",
    wqi: 66,
    status: "Moderate",
    ph: 7.0,
    oxygen: 6.2,
    temperature: 24,
    turbidity: 40,
    trend: "up",
    locations: ["Sangli", "Vijayawada", "Mahabaleshwar"]
  },
  {
    slug: "tapi",
    name: "Tapi",
    description: "Flows through central India with seasonal variations impacting water quality.",
    wqi: 58,
    status: "Moderate",
    ph: 7.3,
    oxygen: 5.6,
    temperature: 26,
    turbidity: 50,
    trend: "down",
    locations: ["Surat", "Burhanpur", "Bhussawal"]
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

export default function RiverDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const river = useMemo(() => RIVER_DATA.find(r => r.slug === slug), [slug]);

  if (!river) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>River not found</CardTitle>
            <CardDescription>The requested river does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Go back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{river.name} - Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Water Quality Overview</CardTitle>
            <Badge className={`${getStatusColor(river.status)} text-white`}>{river.status}</Badge>
          </div>
          <CardDescription>Water Quality Index: {river.wqi}/100</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">{river.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>WQI Score</span>
              <span>{river.wqi}/100</span>
            </div>
            <Progress value={river.wqi} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-muted-foreground">pH Level</div>
                <div className="font-medium">{river.phText || river.ph}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-muted-foreground">Oxygen (mg/L)</div>
                <div className="font-medium">{river.oxygen}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-muted-foreground">Temperature (°C)</div>
                <div className="font-medium">{river.temperature}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-muted-foreground">Turbidity (NTU)</div>
                <div className="font-medium">{river.turbidity}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Common Monitoring Locations</div>
            <div className="flex flex-wrap gap-2">
              {river.locations.map((loc) => (
                <span key={loc} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
