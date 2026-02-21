export interface Vehicle {
  id: number;
  name: string;
  license_plate: string;
  type: 'Truck' | 'Van' | 'Bike';
  max_load: number;
  odometer: number;
  status: 'Available' | 'In Shop' | 'On Trip' | 'Out of Service';
  region: string;
}

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_expiry: string;
  status: 'On Duty' | 'Off Duty' | 'Suspended';
  safety_score: number;
  completion_rate?: number;
  complaints?: number;
}

export interface Trip {
  id: number;
  vehicle_id: number;
  driver_id: number;
  vehicle_name?: string;
  driver_name?: string;
  cargo_weight: number;
  status: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
  origin: string;
  destination: string;
  estimated_fuel_cost?: number;
  created_at: string;
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
