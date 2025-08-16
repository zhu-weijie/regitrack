import axios from 'axios';
import type { Vehicle } from '../types/vehicle';

// The API base URL will point to our Dockerized backend service
const API_URL = '/api';

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return []; // Return an empty array on error
  }
};
