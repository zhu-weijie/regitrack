import { useState, useEffect } from 'react';
import { type View } from 'react-big-calendar';
import { addYears, subYears } from 'date-fns';
import type { Vehicle } from './types/vehicle';
import { getVehicles } from './services/apiService';
import { VehicleTable } from './components/VehicleTable';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { VehicleCalendar } from './components/VehicleCalendar';
import { CalendarControls } from './components/CalendarControls';
import { CircularProgress, Box } from '@mui/material';

type AppView = 'list' | 'calendar';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [appView, setAppView] = useState<AppView>('list');

  const [calendarDate, setCalendarDate] = useState<Date>(
    new Date('2022-11-01')
  );
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

  const handlePrevYear = () => {
    setCalendarDate((prevDate) => subYears(prevDate, 1));
  };

  const handleNextYear = () => {
    setCalendarDate((prevDate) => addYears(prevDate, 1));
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
      <CalendarControls
        appView={appView}
        calendarDate={calendarDate}
        onAppViewChange={handleViewChange}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
      />

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
