import express from 'express';
import cors from 'cors';
import { loadAllVehicles, getAllVehicles } from './services/data.service';

const app = express();
const port = 3000;

// Enable CORS for our frontend to access the API
app.use(cors());

// Define the /api/vehicles endpoint
app.get('/api/vehicles', (req, res) => {
  const vehicles = getAllVehicles();
  res.json(vehicles);
});

const startServer = async () => {
  // Load data before starting the server
  await loadAllVehicles();

  app.listen(port, () => {
    console.log(`API server is listening on http://localhost:${port}`);
  });
};

startServer();
