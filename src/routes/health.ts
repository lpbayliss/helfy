import { Hono } from "hono";
import { testConnection } from "../db/connection.js";
import { Logger } from "../lib/logger.js";

const app = new Hono();

app.get("/", async (c) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: "checking...",
    },
  };

  try {
    // Test database connection
    const dbHealthy = await testConnection();
    health.services.database = dbHealthy ? "healthy" : "unhealthy";
    
    // Set appropriate HTTP status
    const status = dbHealthy ? 200 : 503;
    
    return c.json(health, status);
  } catch (error) {
    Logger.error("Health check failed:", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    health.services.database = "error";
    return c.json(health, 503);
  }
});

export default app;
