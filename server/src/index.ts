import { serve } from "@hono/node-server";
import app from "./app.js";

const port = parseInt(process.env.API_PORT || "3001");

console.log(`🚀 PCBuilderAI API Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server is running on http://localhost:${port}`);
