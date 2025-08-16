import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import type { Vehicle } from '../types/vehicle';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

// Style for the modal box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const VehicleDetailModal = ({
  vehicle,
  onClose,
}: VehicleDetailModalProps) => {
  if (!vehicle) {
    return null;
  }

  return (
    <Modal open={!!vehicle} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Vehicle Details
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="UUID" secondary={vehicle.uuid} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Brand" secondary={vehicle.brand} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Type" secondary={vehicle.type} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Class" secondary={vehicle.vehicle_class} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Status"
              secondary={
                <Chip
                  label={vehicle.status}
                  color={vehicle.status === 'REGISTERED' ? 'success' : 'error'}
                  size="small"
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Registration Date"
              secondary={`${vehicle.start_date} at ${vehicle.time}`}
            />
          </ListItem>
        </List>
      </Box>
    </Modal>
  );
};
