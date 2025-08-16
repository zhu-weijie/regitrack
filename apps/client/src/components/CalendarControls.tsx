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
}

export const CalendarControls = ({
  appView,
  calendarDate,
  onAppViewChange,
  onPrevYear,
  onNextYear,
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

      {appView === 'calendar' && (
        <ButtonGroup variant="outlined" aria-label="calendar navigation">
          <Button onClick={onPrevYear}>
            <KeyboardDoubleArrowLeftIcon />
          </Button>
          <Typography
            sx={{
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(25, 118, 210, 0.5)',
              minWidth: '150px',
              justifyContent: 'center',
            }}
          >
            {format(calendarDate, 'MMMM yyyy')}
          </Typography>
          <Button onClick={onNextYear}>
            <KeyboardDoubleArrowRightIcon />
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};
