import { useState, useEffect } from 'react';
import { Vehicle } from './types/vehicle';
import { getVehicles } from './services/apiService';
import { VehicleTable } from './components/VehicleTable';
import { CircularProgress, Box } from '@mui/material';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <VehicleTable vehicles={vehicles} />;
}

export default App;
