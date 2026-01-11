
import { Job, LicenseCategory, City, TruckModel, Company, TruckInstance, Loan } from '../types';
import { CITIES, TRUCK_MODELS, XP_PER_KM, FUEL_PRICE_PER_L } from '../constants';

export const generateJob = (playerLevel: number): Job => {
  const from = CITIES[Math.floor(Math.random() * CITIES.length)];
  let to = CITIES[Math.floor(Math.random() * CITIES.length)];
  while (to.id === from.id) {
    to = CITIES[Math.floor(Math.random() * CITIES.length)];
  }

  const distance = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)) * 5;
  const categories = Object.values(LicenseCategory);
  const requiredLicense = categories[Math.floor(Math.random() * categories.length)];
  
  const baseRate = 12; // $/km
  const urgencyMultiplier = Math.random() > 0.7 ? 1.5 : 1.0;
  const payout = Math.round(distance * baseRate * (1 + playerLevel * 0.05) * urgencyMultiplier);

  return {
    id: Math.random().toString(36).substr(2, 9),
    cargo: ['Electronics', 'Auto Parts', 'Fruit', 'Lumber', 'Chemicals', 'Machinery'][Math.floor(Math.random() * 6)],
    weight: Math.floor(Math.random() * 20000) + 1000,
    from: from.id,
    to: to.id,
    payout,
    urgency: urgencyMultiplier > 1 ? 'high' : 'low',
    type: 'common',
    requiredLicense,
    distance,
    deadline: Date.now() + (distance * 2000) // Rough deadline
  };
};

export const calculateTripCosts = (truck: TruckModel, distance: number) => {
  const fuelConsumed = (truck.consumption / 100) * distance;
  const fuelCost = fuelConsumed * FUEL_PRICE_PER_L;
  const maintenanceCost = distance * 0.45; // $0.45 per km
  return { fuelCost, maintenanceCost, fuelConsumed };
};

export const calculateLoanMonthlyPayment = (principal: number, annualRate: number, termMonths: number): number => {
  const monthlyRate = annualRate / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
};

export const createLoan = (amount: number, annualRate: number, termMonths: number): Loan => {
  const monthlyPayment = calculateLoanMonthlyPayment(amount, annualRate, termMonths);
  return {
    id: Math.random().toString(36).substr(2, 9),
    principal: amount,
    remainingBalance: monthlyPayment * termMonths, // Simplified: Total to pay back including interest
    interestRate: annualRate / 12,
    monthlyPayment,
    termMonths,
    paidMonths: 0
  };
};

export const getCityName = (id: string) => CITIES.find(c => c.id === id)?.name || id;
export const getTruckModel = (id: string) => TRUCK_MODELS.find(m => m.id === id);

export const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
