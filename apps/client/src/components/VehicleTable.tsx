import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import type { Vehicle } from '../types/vehicle';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

export const VehicleTable = ({
  vehicles,
  onVehicleClick,
}: VehicleTableProps) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vehicle Registrations
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vehicle table">
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow
                key={vehicle.uuid}
                onClick={() => onVehicleClick(vehicle)}
                sx={{
                  '&:hover': { cursor: 'pointer', backgroundColor: '#f5f5f5' },
                }}
              >
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell style={{ textTransform: 'capitalize' }}>
                  {vehicle.vehicle_class}
                </TableCell>
                <TableCell>
                  <Chip
                    label={vehicle.status}
                    color={
                      vehicle.status === 'REGISTERED' ? 'success' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{vehicle.start_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
