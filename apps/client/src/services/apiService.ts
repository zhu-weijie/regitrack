import axios from 'axios';
import { Vehicle } from '../types/vehicle';

// The API base URL will point to our Dockerized backend service
const API_URL = 'http://localhost:3000/api';

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return []; // Return an empty array on error
  }
};
