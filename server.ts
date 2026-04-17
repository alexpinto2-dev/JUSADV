import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import fs from "fs";

// Import modules
import { jurisprudenciaRoutes } from "./src/server/routes/jurisprudencia.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Attach module routes
  app.use('/api/jurisprudencia', jurisprudenciaRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Determine the dist directory path
    const __dirname = path.resolve(); // Equivalent to __dirname in ESM when running in project root
    const distPath = path.join(__dirname, 'dist');
    
    // Serve static files from dist
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
