import { useEffect } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import type { ComponentProps } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Vehicle } from '../types/vehicle';
import {
  Box,
  Paper,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type CustomEventProps = ComponentProps<typeof Calendar>['components']['event'];

const CustomEvent = (props: CustomEventProps) => {
  if (!props.event) {
    return null;
  }
  const { event } = props;
  return (
    <Chip
      label={`${event.brand} (${event.type})`}
      color={event.status === 'REGISTERED' ? 'success' : 'error'}
      size="small"
      sx={{ width: '100%' }}
    />
  );
};

interface VehicleCalendarProps {
  vehicles: Vehicle[];
  onSelectEvent: (vehicle: Vehicle) => void;
  date: Date;
  view: View;
  onNavigate: (newDate: Date) => void;
  onViewChange: (newView: View) => void;
}

export const VehicleCalendar = ({
  vehicles,
  onSelectEvent,
  date,
  view,
  onNavigate,
  onViewChange,
}: VehicleCalendarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isMobile) {
      onViewChange('agenda');
    }
  }, [isMobile, onViewChange]);

  // Map vehicle data to the format react-big-calendar expects
  const events = vehicles.map((vehicle) => {
    // The date format from CSV is 'dd/MM/yyyy'
    const startDate = parse(vehicle.start_date, 'dd/MM/yyyy', new Date());
    return {
      ...vehicle,
      title: `${vehicle.brand} - ${vehicle.type}`,
      start: startDate,
      end: startDate, // For single-day events
    };
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vehicle Registrations Calendar
      </Typography>
      <Paper sx={{ height: '80vh', padding: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={onSelectEvent}
          components={{
            event: CustomEvent,
          }}
          date={date}
          view={view}
          onNavigate={onNavigate}
          onView={onViewChange}
          toolbar={!isMobile}
        />
      </Paper>
    </Box>
  );
};
