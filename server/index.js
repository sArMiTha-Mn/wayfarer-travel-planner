import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Wayfarer API',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Serve frontend in production if built
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing in production, fallback to index.html for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Wayfarer Backend API is running on port ' + PORT + '. Run the Vite client for frontend development.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✈️  Wayfarer backend server listening at http://localhost:${PORT}`);
  console.log(`📡 API endpoints ready at http://localhost:${PORT}/api/`);
});
