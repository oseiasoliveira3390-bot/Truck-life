
export enum LicenseCategory {
  B = 'B', // Light Trucks
  C = 'C', // Medium Trucks
  D = 'D', // Heavy Trucks
  E = 'E'  // Bi-trains & Special
}

export interface City {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance: number;
}

export interface TruckModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  hp: number;
  consumption: number; // L/100km
  capacity: number; // kg
  category: LicenseCategory;
  basePrice: number;
}

export interface TruckInstance {
  id: string;
  modelId: string;
  condition: number; // 0-100
  mileage: number;
  fuel: number;
  ownerId: string; // 'player' or company id
  purchasePrice: number;
}

export interface Job {
  id: string;
  cargo: string;
  weight: number;
  from: string;
  to: string;
  payout: number;
  urgency: 'low' | 'med' | 'high';
  type: 'common' | 'fragile' | 'dangerous' | 'special';
  requiredLicense: LicenseCategory;
  distance: number;
  deadline: number; // timestamp or distance based
}

export interface Company {
  id: string;
  name: string;
  reputation: number;
  balance: number;
  strategy: 'aggressive' | 'balanced' | 'conservative';
  fleetIds: string[];
}

export interface Loan {
  id: string;
  principal: number;
  remainingBalance: number;
  interestRate: number; // Monthly rate in decimal
  monthlyPayment: number;
  termMonths: number;
  paidMonths: number;
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  reputation: number;
  money: number;
  license: LicenseCategory;
  history: {
    deliveries: number;
    fines: number;
    accidents: number;
  };
  currentTruckId: string | null;
  activeJobId: string | null;
  inventoryTruckIds: string[];
  loans: Loan[];
}

export interface GameState {
  player: PlayerProfile;
  trucks: TruckInstance[];
  companies: Company[];
  availableJobs: Job[];
  currentTime: number;
  weather: 'sunny' | 'rainy' | 'foggy';
  isDriving: boolean;
  drivingProgress: number; // 0 to 1
  gameLog: string[];
}
