import {
  Box,
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';

type AppView = 'list' | 'calendar';

interface CalendarControlsProps {
  appView: AppView;
  calendarDate: Date;
  onAppViewChange: (/*...*/) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarControls = ({
  appView,
  calendarDate,
  onAppViewChange,
  onPrevYear,
  onNextYear,
  onPrevMonth,
  onNextMonth,
}: CalendarControlsProps) => {
  return (
    <Box
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        value={appView}
        exclusive
        onChange={onAppViewChange}
        aria-label="view toggle"
      >
        <ToggleButton value="list">List View</ToggleButton>
        <ToggleButton value="calendar">Calendar View</ToggleButton>
      </ToggleButtonGroup>

      {/* --- RENDER UNIFIED CONTROLS FOR ALL SIZES --- */}
      {appView === 'calendar' && (
        <ButtonGroup variant="outlined" aria-label="calendar navigation">
          <Button onClick={onPrevYear} title="Previous Year">
            <KeyboardDoubleArrowLeftIcon />
          </Button>
          <Button onClick={onPrevMonth} title="Previous Month">
            <ChevronLeftIcon />
          </Button>
          <Typography
            sx={{
              padding: { xs: '0 8px', sm: '0 16px' }, // Adjust padding for mobile
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid rgba(25, 118, 210, 0.5)',
              borderBottom: '1px solid rgba(25, 118, 210, 0.5)',
              minWidth: { xs: '120px', sm: '150px' }, // Adjust min-width for mobile
              justifyContent: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }, // Adjust font size for mobile
            }}
          >
            {format(calendarDate, 'MMMM yyyy')}
          </Typography>
          <Button onClick={onNextMonth} title="Next Month">
            <ChevronRightIcon />
          </Button>
          <Button onClick={onNextYear} title="Next Year">
            <KeyboardDoubleArrowRightIcon />
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};
