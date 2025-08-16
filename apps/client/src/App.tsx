import { useState, useEffect, useMemo } from 'react';
import { type View } from 'react-big-calendar';
import { addYears, subYears } from 'date-fns';
import type { Vehicle } from './types/vehicle';
import { getVehicles } from './services/apiService';
import { VehicleTable } from './components/VehicleTable';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { VehicleCalendar } from './components/VehicleCalendar';
import { CalendarControls } from './components/CalendarControls';
import { FilterControls, type Filters } from './components/FilterControls';
import { CircularProgress, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

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

  const [filters, setFilters] = useState<Filters>({
    status: 'ALL',
    type: 'ALL',
    vehicle_class: 'ALL',
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const statusMatch =
        filters.status === 'ALL' || vehicle.status === filters.status;
      const typeMatch = filters.type === 'ALL' || vehicle.type === filters.type;
      const classMatch =
        filters.vehicle_class === 'ALL' ||
        vehicle.vehicle_class === filters.vehicle_class;
      return statusMatch && typeMatch && classMatch;
    });
  }, [vehicles, filters]);

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

      <FilterControls filters={filters} onFilterChange={handleFilterChange} />

      {appView === 'list' ? (
        <VehicleTable
          vehicles={filteredVehicles}
          onVehicleClick={handleVehicleClick}
        />
      ) : (
        <VehicleCalendar
          vehicles={filteredVehicles}
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
