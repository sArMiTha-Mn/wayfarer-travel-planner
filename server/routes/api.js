import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { curatedDestinations } from '../data/destinations.js';
import { generateItinerary } from '../services/itineraryEngine.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tripsFilePath = path.join(__dirname, '../data/trips.json');

// Helper to safely read trips JSON
function readTrips() {
  try {
    if (!fs.existsSync(tripsFilePath)) {
      fs.writeFileSync(tripsFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(tripsFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading trips:', err);
    return [];
  }
}

// Helper to safely write trips JSON
function writeTrips(trips) {
  try {
    fs.writeFileSync(tripsFilePath, JSON.stringify(trips, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing trips:', err);
    return false;
  }
}

// 1. GET /api/destinations - list curated destinations with search/filter
router.get('/destinations', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (query) {
    const filtered = curatedDestinations.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.region.toLowerCase().includes(query)
    );
    return res.json(filtered);
  }
  return res.json(curatedDestinations);
});

// 2. GET /api/destinations/:id - get single destination details
router.get('/destinations/:id', (req, res) => {
  const dest = curatedDestinations.find((d) => d.id === req.params.id);
  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  return res.json(dest);
});

// 3. POST /api/generate - generate day-by-day itinerary
router.post('/generate', (req, res) => {
  try {
    const plan = generateItinerary(req.body);
    return res.json({ success: true, itinerary: plan });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({ error: 'Failed to generate itinerary', details: err.message });
  }
});

// 4. GET /api/trips - list all saved trips
router.get('/trips', (req, res) => {
  const trips = readTrips();
  // Return sorted with latest first
  trips.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return res.json(trips);
});

// 5. POST /api/trips - save new trip
router.post('/trips', (req, res) => {
  try {
    const trip = req.body;
    if (!trip.id) {
      trip.id = `trip-${Date.now()}`;
    }
    if (!trip.createdAt) {
      trip.createdAt = new Date().toISOString();
    }
    const trips = readTrips();
    // Check if trip with same ID exists, update it instead
    const existingIndex = trips.findIndex((t) => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }
    writeTrips(trips);
    return res.status(201).json({ success: true, trip });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save trip', details: err.message });
  }
});

// 6. GET /api/trips/:id - get specific trip
router.get('/trips/:id', (req, res) => {
  const trips = readTrips();
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  return res.json(trip);
});

// 7. PUT /api/trips/:id - update existing trip
router.put('/trips/:id', (req, res) => {
  const trips = readTrips();
  const index = trips.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  trips[index] = { ...trips[index], ...req.body, updatedAt: new Date().toISOString() };
  writeTrips(trips);
  return res.json({ success: true, trip: trips[index] });
});

// 8. DELETE /api/trips/:id - delete trip
router.delete('/trips/:id', (req, res) => {
  const trips = readTrips();
  const filtered = trips.filter((t) => t.id !== req.params.id);
  if (filtered.length === trips.length) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  writeTrips(filtered);
  return res.json({ success: true, message: 'Trip deleted successfully' });
});

export default router;
