export interface Vehicle {
  id: string; // Changed to string for UUID
  name: string;
  licensePlate: string;
  type: string;
  maxCapacity: number;
  odometer: number;
  status: string;
  region?: string;
}

export interface Driver {
  id: string; // Changed to string for UUID
  name: string;
  licenseType: string;
  licenseExpiry: string;
  status: string; // Enum from backend
  safetyScore: number;
  createdAt?: string;
}

export interface Trip {
  id: string; // Changed to string for UUID
  vehicleId: string;
  driverId: string;
  vehicleName?: string; // Optional if joined
  driverName?: string; // Optional if joined
  cargoWeight: number;
  status: string; // Enum from backend
  origin: string;
  destination: string;
  estimatedFuelCost: number;
  revenue: number;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  vehicle_name?: string;
  issue: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ExpenseRecord {
  id: number;
  trip_id: number;
  driver_name: string;
  fuel_cost: number;
  misc_expense: number;
  date: string;
}

export interface FinancialSummary {
  month: string;
  revenue: number;
  fuel_cost: number;
  maintenance: number;
  net_profit: number;
}

export interface DashboardStats {
  activeFleet: number;
  maintenanceAlerts: number;
  utilizationRate: number;
  pendingCargo: number;
  totalRevenue: number;
  fuelSpend: number;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';
  avatar?: string;
}
