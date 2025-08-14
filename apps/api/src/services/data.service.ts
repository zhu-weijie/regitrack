import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Vehicle } from '../types/vehicle';

const dataDirectory = path.join(__dirname, '..', 'data');

const files = [
  { name: 'personal.csv', class: 'personal' as const },
  { name: 'commercial.csv', class: 'commercial' as const },
  { name: 'deregpersonal.csv', class: 'personal' as const },
  { name: 'deregcommerical.csv', class: 'commercial' as const },
];

let allVehicles: Vehicle[] = [];
let isLoaded = false;

const parseFile = (
  fileName: string,
  vehicleClass: 'personal' | 'commercial'
): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    const results: Vehicle[] = [];
    const filePath = path.join(dataDirectory, fileName);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Standardize headers and add vehicle_class
        const vehicle: Partial<Vehicle> = {
          ...data,
          vehicle_class: vehicleClass,
        };
        results.push(vehicle as Vehicle);
      })
      .on('end', () => {
        console.log(`Successfully parsed ${fileName}`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`Error parsing ${fileName}:`, error);
        reject(error);
      });
  });
};

export const loadAllVehicles = async (): Promise<void> => {
  if (isLoaded) {
    console.log('Data already loaded.');
    return;
  }
  try {
    const parsingPromises = files.map((file) =>
      parseFile(file.name, file.class)
    );
    const results = await Promise.all(parsingPromises);
    allVehicles = results.flat(); // Combine all results into one array
    isLoaded = true;
    console.log(`Total vehicles loaded: ${allVehicles.length}`);
  } catch (error) {
    console.error('Failed to load vehicle data:', error);
    allVehicles = [];
    isLoaded = false;
  }
};

export const getAllVehicles = (): Vehicle[] => {
  return allVehicles;
};
