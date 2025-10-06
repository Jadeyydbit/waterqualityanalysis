import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = ["#22c55e", "#facc15", "#f87171", "#60a5fa", "#a78bfa"];

export default function WaterQualityCharts() {
  const [wqiStats, setWqiStats] = useState(null);
  const [wqiByLocation, setWqiByLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  // Fetch WQI status distribution
  fetch("http://localhost:8000/api/wqi-stats/")
    .then((res) => res.json())
    .then((data) => {
      setWqiStats(data);
      setLoading(false);
    })
    .catch((err) => {
      setError("Failed to load WQI stats");
      setLoading(false);
    });

  // Fetch WQI by location
  fetch("http://localhost:8000/api/locations/")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.locations)) {
        // For demo, generate random WQI for each location
        setWqiByLocation(data.locations.map(loc => ({
          location: loc,
          wqi: Math.floor(Math.random() * 100)
        })));
      }
    });
  }, []);

  if (loading) return <div className="text-center my-8">Loading charts...</div>;
  if (error) return <div className="text-center my-8 text-red-600">{error}</div>;
  if (!wqiStats) return null;

  // Pie chart: WQI status distribution
  const pieLabels = Object.keys(wqiStats);
  const pieValues = pieLabels.map((k) => wqiStats[k]);
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: "WQI Proportion",
        data: pieValues,
        backgroundColor: COLORS,
      },
    ],
  };

  // Bar chart: WQI by location
  const barLabels = wqiByLocation.map(l => l.location);
  const barValues = wqiByLocation.map(l => l.wqi);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "WQI by Location",
        data: barValues,
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100">
        <h3 className="font-bold mb-2 text-blue-700">WQI by Location</h3>
        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            title: { display: false },
          },
          animation: { duration: 1200 },
        }} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100">
        <h3 className="font-bold mb-2 text-blue-700">WQI Status Distribution</h3>
        <Pie data={pieData} options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: { enabled: true },
            title: { display: false },
          },
          animation: { duration: 1200 },
        }} />
      </div>
    </div>
  );
}
