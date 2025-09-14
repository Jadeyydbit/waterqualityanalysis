import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getRivers, upsertRiver, generateSlug } from "@/lib/rivers";

function isAdmin() {
  try {
    return localStorage.getItem("role") === "admin";
  } catch (e) {
    return false;
  }
}

export default function EditRiver() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [error, setError] = useState("");
  const rivers = useMemo(() => getRivers(), []);
  const existing = rivers.find((r) => r.slug === slug);

  const [form, setForm] = useState(() => ({
    name: existing?.location || "",
    wqi: existing?.wqi?.toString?.() || "",
    status: existing?.status || "Moderate",
    ph: existing?.ph?.toString?.() || "",
    oxygen: existing?.oxygen?.toString?.() || "",
    temperature: existing?.temperature?.toString?.() || "",
    turbidity: existing?.turbidity?.toString?.() || "",
    trend: existing?.trend || "up",
  }));

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  if (!existing) {
    return (
      <div className="p-6">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Not found</CardTitle>
            <CardDescription>The river you are trying to edit does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard/admin")}>Back to Admin</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name) return setError("Name is required");
    if (!form.wqi || isNaN(Number(form.wqi))) return setError("Valid WQI is required");

    const updated = {
      slug: generateSlug(form.name),
      location: form.name,
      wqi: Number(form.wqi),
      status: form.status,
      ph: Number(form.ph || 7),
      oxygen: Number(form.oxygen || 5),
      temperature: Number(form.temperature || 25),
      turbidity: Number(form.turbidity || 40),
      trend: form.trend,
    };

    // Use original slug to update in place without creating a copy
    upsertRiver(updated, slug);
    navigate("/dashboard/admin");
  };

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit River</CardTitle>
          <CardDescription>
            Updating <span className="font-medium">{existing.location}</span> ({slug})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wqi">WQI</Label>
                <Input id="wqi" name="wqi" type="number" value={form.wqi} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={form.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Moderate</option>
                  <option>Poor</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ph">pH</Label>
                <Input id="ph" name="ph" type="number" step="0.1" value={form.ph} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oxygen">Oxygen (mg/L)</Label>
                <Input id="oxygen" name="oxygen" type="number" step="0.1" value={form.oxygen} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input id="temperature" name="temperature" type="number" value={form.temperature} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                <Input id="turbidity" name="turbidity" type="number" value={form.turbidity} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trend">Trend</Label>
              <select id="trend" name="trend" value={form.trend} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
