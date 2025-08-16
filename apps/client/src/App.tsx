import { useState, useEffect } from 'react';
import type { Vehicle } from './types/vehicle';
import { getVehicles } from './services/apiService';
import { VehicleTable } from './components/VehicleTable';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { VehicleCalendar } from './components/VehicleCalendar';
import {
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

type View = 'list' | 'calendar';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // State for the selected vehicle
  const [view, setView] = useState<View>('list');

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: View | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

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

  return (
    <>
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="list">List View</ToggleButton>
          <ToggleButton value="calendar">Calendar View</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === 'list' ? (
        <VehicleTable vehicles={vehicles} onVehicleClick={handleVehicleClick} />
      ) : (
        <VehicleCalendar
          vehicles={vehicles}
          onSelectEvent={handleVehicleClick}
        />
      )}

      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default App;
