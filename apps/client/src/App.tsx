import { useState, useEffect } from 'react';
import { type View } from 'react-big-calendar';
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

type AppView = 'list' | 'calendar';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // State for the selected vehicle
  const [appView, setAppView] = useState<AppView>('list');

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<View>('month');

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
    newView: AppView | null
  ) => {
    if (newView !== null) {
      setAppView(newView);
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
          value={appView}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="list">List View</ToggleButton>
          <ToggleButton value="calendar">Calendar View</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {appView === 'list' ? (
        <VehicleTable vehicles={vehicles} onVehicleClick={handleVehicleClick} />
      ) : (
        <VehicleCalendar
          vehicles={vehicles}
          onSelectEvent={handleVehicleClick}
          date={calendarDate}
          view={calendarView}
          onNavigate={setCalendarDate}
          onView={setCalendarView}
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
