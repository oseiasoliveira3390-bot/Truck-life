
import { City, Route, TruckModel, LicenseCategory } from './types';

export const CITIES: City[] = [
  { id: 'berlin', name: 'Berlin', x: 200, y: 150 },
  { id: 'paris', name: 'Paris', x: 50, y: 300 },
  { id: 'london', name: 'London', x: 30, y: 200 },
  { id: 'rome', name: 'Rome', x: 300, y: 500 },
  { id: 'madrid', name: 'Madrid', x: 20, y: 550 },
  { id: 'warsaw', name: 'Warsaw', x: 350, y: 120 },
  { id: 'prague', name: 'Prague', x: 250, y: 250 },
  { id: 'vienna', name: 'Vienna', x: 280, y: 320 },
];

export const TRUCK_MODELS: TruckModel[] = [
  { id: 'vlk-lt1', brand: 'Volker', model: 'Lite T1', year: 2022, hp: 280, consumption: 18, capacity: 5000, category: LicenseCategory.B, basePrice: 45000 },
  { id: 'vlk-md2', brand: 'Volker', model: 'Medium M2', year: 2021, hp: 420, consumption: 25, capacity: 12000, category: LicenseCategory.C, basePrice: 95000 },
  { id: 'vlk-hv3', brand: 'Volker', model: 'Heavy H3', year: 2023, hp: 580, consumption: 32, capacity: 25000, category: LicenseCategory.D, basePrice: 180000 },
  { id: 'sc-prime', brand: 'Scandia', model: 'Prime S', year: 2024, hp: 730, consumption: 38, capacity: 40000, category: LicenseCategory.E, basePrice: 260000 },
];

export const LICENSE_REQUIREMENTS = {
  [LicenseCategory.B]: { minLevel: 1, cost: 0 },
  [LicenseCategory.C]: { minLevel: 5, cost: 5000 },
  [LicenseCategory.D]: { minLevel: 12, cost: 15000 },
  [LicenseCategory.E]: { minLevel: 25, cost: 40000 },
};

export const INITIAL_PLAYER_MONEY = 15000;
export const XP_PER_KM = 5;
export const FUEL_PRICE_PER_L = 1.65;
