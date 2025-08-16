import {
  Box,
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  useMediaQuery, // Add media query hooks
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
  onAppViewChange: (
    _event: React.MouseEvent<HTMLElement>,
    newView: AppView | null
  ) => void;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

      {appView === 'calendar' && !isMobile && (
        <ButtonGroup
          variant="outlined"
          aria-label="desktop calendar navigation"
        >
          <Button onClick={onPrevYear}>
            <KeyboardDoubleArrowLeftIcon />
          </Button>
          <Typography /* ... */>{format(calendarDate, 'MMMM yyyy')}</Typography>
          <Button onClick={onNextYear}>
            <KeyboardDoubleArrowRightIcon />
          </Button>
        </ButtonGroup>
      )}

      {/* --- MOBILE MONTH NAVIGATION --- */}
      {appView === 'calendar' && isMobile && (
        <ButtonGroup variant="outlined" aria-label="mobile calendar navigation">
          <Button onClick={onPrevMonth}>
            <ChevronLeftIcon />
          </Button>
          <Typography /* ... */>{format(calendarDate, 'MMMM yyyy')}</Typography>
          <Button onClick={onNextMonth}>
            <ChevronRightIcon />
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};
