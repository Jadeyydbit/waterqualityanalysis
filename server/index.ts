// server/index.ts
import express from "express";
import { handleRegression, handleClassification, handleClustering } from "./routes/ml";

export function createServer() {
  const app = express();

  // ...existing code (app setup, middleware)...

  // ML endpoints
  app.post("/api/ml/regression", handleRegression);
  app.post("/api/ml/classify", handleClassification);
  app.post("/api/ml/cluster", handleClustering);

  // ...existing code (other routes, vite integration, listen)...

  return app;
}