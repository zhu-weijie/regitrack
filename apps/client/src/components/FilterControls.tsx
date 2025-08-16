import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

export interface Filters {
  status: 'ALL' | 'REGISTERED' | 'DEREGISTERED';
  type: 'ALL' | '5-seat' | '7-seat';
  vehicle_class: 'ALL' | 'personal' | 'commercial';
}

interface FilterControlsProps {
  filters: Filters;
  onFilterChange: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => void;
}

export const FilterControls = ({
  filters,
  onFilterChange,
}: FilterControlsProps) => {
  return (
    <Box sx={{ paddingX: 3, paddingBottom: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              name="status"
              value={filters.status}
              label="Status"
              onChange={onFilterChange}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="REGISTERED">Registered</MenuItem>
              <MenuItem value="DEREGISTERED">Deregistered</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="type-filter-label">Vehicle Type</InputLabel>
            <Select
              labelId="type-filter-label"
              name="type"
              value={filters.type}
              label="Vehicle Type"
              onChange={onFilterChange}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="5-seat">5-seat</MenuItem>
              <MenuItem value="7-seat">7-seat</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="class-filter-label">Vehicle Class</InputLabel>
            <Select
              labelId="class-filter-label"
              name="vehicle_class"
              value={filters.vehicle_class}
              label="Vehicle Class"
              onChange={onFilterChange}
            >
              <MenuItem value="ALL">All Classes</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
