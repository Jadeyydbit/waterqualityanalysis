import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getRivers, deleteRiver } from "@/lib/rivers";
import { Trash2, Plus } from "lucide-react";

function isAdmin() {
  try {
    return localStorage.getItem("role") === "admin";
  } catch (e) {
    return false;
  }
}

export default function Admin() {
  const navigate = useNavigate();
  const [rivers, setRivers] = useState([]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    setRivers(getRivers());
  }, [navigate]);

  const handleDelete = (slug) => {
    if (!window.confirm("Delete this river?")) return;
    const updated = deleteRiver(slug);
    setRivers(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin - Manage Rivers</h1>
        <Button asChild>
          <Link to="/dashboard/admin/rivers/new">
            <Plus className="w-4 h-4 mr-2" /> Add River
          </Link>
        </Button>
      </div>

      {rivers.length === 0 ? (
        <Alert>
          <AlertDescription>
            No rivers found. Add a new river to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {rivers.map((r) => (
            <Card key={r.slug}>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{r.location}</CardTitle>
                  <CardDescription>WQI: {r.wqi}/100</CardDescription>
                </div>
                <Badge>{r.status}</Badge>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(r.slug)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
