import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("fleetflow.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('Truck', 'Van', 'Bike')) NOT NULL,
    max_load REAL NOT NULL,
    odometer REAL DEFAULT 0,
    status TEXT CHECK(status IN ('Available', 'In Shop', 'On Trip', 'Out of Service')) DEFAULT 'Available',
    region TEXT
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    status TEXT CHECK(status IN ('On Duty', 'Off Duty', 'Suspended')) DEFAULT 'Off Duty',
    safety_score REAL DEFAULT 100,
    completion_rate REAL DEFAULT 100,
    complaints INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    driver_id INTEGER,
    cargo_weight REAL NOT NULL,
    status TEXT CHECK(status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')) DEFAULT 'Draft',
    origin TEXT,
    destination TEXT,
    estimated_fuel_cost REAL,
    revenue REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY(driver_id) REFERENCES drivers(id)
  );

  CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    description TEXT,
    cost REAL,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Pending',
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER,
    driver_name TEXT,
    fuel_cost REAL,
    misc_expense REAL,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(trip_id) REFERENCES trips(id)
  );

  CREATE TABLE IF NOT EXISTS fuel_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    liters REAL,
    cost REAL,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// MIGRATION: Ensure 'revenue' column exists in trips table
try {
  const tableInfo = db.prepare("PRAGMA table_info(trips)").all() as any[];
  const hasRevenue = tableInfo.some(col => col.name === 'revenue');
  if (!hasRevenue) {
    db.prepare("ALTER TABLE trips ADD COLUMN revenue REAL DEFAULT 0").run();
  }
} catch (e) {
  // Column likely exists or table doesn't exist yet
}

// Seed some data if empty
const vehicleCount = db.prepare("SELECT COUNT(*) as count FROM vehicles").get() as { count: number };
if (vehicleCount.count === 0) {
  db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, status, region) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Tata Prima 4028.S", "MH-12-AB-1234", "Truck", 40000, 45000, "Available", "West"
  );
  db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, status, region) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Mahindra Bolero Pik-Up", "DL-01-XY-5566", "Van", 1500, 12000, "In Shop", "North"
  );
  db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, status, region) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Ashok Leyland Dost", "KA-05-MN-9988", "Van", 2500, 8000, "On Trip", "South"
  );
  db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, status, region) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Eicher Pro 2049", "HR-38-PQ-4433", "Truck", 5000, 15000, "Available", "North"
  );
  db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, status, region) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Tata Ace Gold", "UP-32-ZZ-1122", "Van", 750, 5000, "Available", "East"
  );
  db.prepare("INSERT INTO drivers (name, license_number, license_expiry, status, safety_score, completion_rate, complaints) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Rajesh Kumar", "DL-9988776655", "2027-12-31", "On Duty", 95, 98.5, 1
  );
  db.prepare("INSERT INTO drivers (name, license_number, license_expiry, status, safety_score, completion_rate, complaints) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Suresh Singh", "MH-1122334455", "2028-06-15", "Off Duty", 88, 92.0, 0
  );
  db.prepare("INSERT INTO drivers (name, license_number, license_expiry, status, safety_score, completion_rate, complaints) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Amit Sharma", "UP-80-AB-4455", "2029-01-20", "Off Duty", 92, 96.0, 0
  );
  db.prepare("INSERT INTO drivers (name, license_number, license_expiry, status, safety_score, completion_rate, complaints) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "Priya Patel", "GJ-01-CD-7788", "2026-05-10", "Off Duty", 97, 99.0, 0
  );
}

// Seed Trips & Expenses if empty (Generate Dummy Data)
const tripsCount = db.prepare("SELECT COUNT(*) as count FROM trips").get() as { count: number };
if (tripsCount.count === 0) {
  // Generate last 6 months of data
  const vehicleIds = (db.prepare("SELECT id FROM vehicles").all() as any[]).map(v => v.id);
  const driverIds = (db.prepare("SELECT id FROM drivers").all() as any[]).map(d => d.id);
  
  if (vehicleIds.length > 0 && driverIds.length > 0) {
    const today = new Date();
    for (let i = 0; i < 50; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - Math.floor(Math.random() * 180));
        const dateStr = pastDate.toISOString().split('T')[0];
        
        const vId = vehicleIds[Math.floor(Math.random() * vehicleIds.length)];
        const dId = driverIds[Math.floor(Math.random() * driverIds.length)];
        const cargo = Math.floor(Math.random() * 5000) + 500;
        const fuel = Math.floor(Math.random() * 5000) + 1000;
        const rev = Math.round((cargo * 12) + (fuel * 1.5));

        const tripResult = db.prepare(`
          INSERT INTO trips (vehicle_id, driver_id, cargo_weight, status, origin, destination, estimated_fuel_cost, revenue, created_at) 
          VALUES (?, ?, ?, 'Completed', 'Mumbai', 'Pune', ?, ?, ?)
        `).run(vId, dId, cargo, fuel, rev, dateStr);

        // Add expense for this trip
        db.prepare(`
          INSERT INTO expenses (trip_id, driver_name, fuel_cost, misc_expense, date)
          VALUES (?, 'System Driver', ?, ?, ?)
        `).run(tripResult.lastInsertRowid, fuel, Math.floor(Math.random() * 500), dateStr);
    }
    console.log("Dummy trips and expenses seeded.");
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // User Sync Route
  app.post("/api/users/sync", (req, res) => {
    const { id, name, email, role, avatar } = req.body;
    try {
      const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      if (existing) {
        db.prepare("UPDATE users SET name = ?, email = ?, role = ?, avatar = ? WHERE id = ?").run(
          name, email, role, avatar, id
        );
      } else {
        db.prepare("INSERT INTO users (id, name, email, role, avatar) VALUES (?, ?, ?, ?, ?)").run(
          id, name, email, role, avatar
        );
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get All Users
  app.get("/api/users", (req, res) => {
    try {
      const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Update User Role
  app.put("/api/users/:id/role", (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });

  // API Routes
  app.get("/api/dashboard/stats", (req, res) => {
    try {
      const activeFleet = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'On Trip'").get() as { count: number };
      const maintenanceAlerts = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'In Shop'").get() as { count: number };
      const totalVehicles = db.prepare("SELECT COUNT(*) as count FROM vehicles").get() as { count: number };
      const assignedVehicles = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status != 'Available'").get() as { count: number };
      const pendingCargo = db.prepare("SELECT COUNT(*) as count FROM trips WHERE status = 'Draft'").get() as { count: number };
      
      // Calculated Financials
      const revenueResult = db.prepare("SELECT SUM(revenue) as total FROM trips").get() as { total: number };
      const expenseResult = db.prepare("SELECT SUM(fuel_cost + misc_expense) as total FROM expenses").get() as { total: number };
      
      // Use real data, simplify fallback logic
      const totalRevenue = revenueResult.total || 0; 
      const fuelSpend = expenseResult.total || 0; 

      res.json({
        activeFleet: activeFleet.count,
        maintenanceAlerts: maintenanceAlerts.count,
        utilizationRate: totalVehicles.count > 0 ? Math.round((assignedVehicles.count / totalVehicles.count) * 100) : 0,
        pendingCargo: pendingCargo.count,
        totalRevenue: totalRevenue > 0 ? totalRevenue : 1250000, // Show mock if 0 for demo
        fuelSpend: fuelSpend > 0 ? fuelSpend : 450000 // Show mock if 0 for demo
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      // Fallback safe response
      res.json({
        activeFleet: 0,
        maintenanceAlerts: 0,
        utilizationRate: 0,
        pendingCargo: 0,
        totalRevenue: 0,
        fuelSpend: 0
      });
    }
  });

  app.get("/api/vehicles", (req, res) => {
    const vehicles = db.prepare("SELECT * FROM vehicles").all();
    res.json(vehicles);
  });

  app.post("/api/vehicles", (req, res) => {
    const { name, license_plate, type, max_load, odometer, region } = req.body;
    try {
      const result = db.prepare("INSERT INTO vehicles (name, license_plate, type, max_load, odometer, region) VALUES (?, ?, ?, ?, ?, ?)").run(
        name, license_plate, type, max_load, odometer, region
      );
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/drivers", (req, res) => {
    const drivers = db.prepare("SELECT * FROM drivers").all();
    res.json(drivers);
  });

  app.post("/api/drivers", (req, res) => {
    const { name, license_number, license_expiry, safety_score } = req.body;
    try {
      const result = db.prepare("INSERT INTO drivers (name, license_number, license_expiry, safety_score) VALUES (?, ?, ?, ?)").run(
        name, license_number, license_expiry, safety_score || 100
      );
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/trips", (req, res) => {
    const trips = db.prepare(`
      SELECT trips.*, vehicles.name as vehicle_name, drivers.name as driver_name 
      FROM trips 
      LEFT JOIN vehicles ON trips.vehicle_id = vehicles.id
      LEFT JOIN drivers ON trips.driver_id = drivers.id
      ORDER BY trips.created_at DESC
    `).all();
    res.json(trips);
  });

  app.post("/api/trips", (req, res) => {
    const { vehicle_id, driver_id, cargo_weight, origin, destination, estimated_fuel_cost, revenue } = req.body;
    
    // Validation Rule: Prevent trip creation if CargoWeight > MaxCapacity
    const vehicle = db.prepare("SELECT max_load FROM vehicles WHERE id = ?").get(vehicle_id) as { max_load: number };
    if (cargo_weight > vehicle.max_load) {
      return res.status(400).json({ error: "Cargo weight exceeds vehicle capacity" });
    }

    // Check driver license
    const driver = db.prepare("SELECT license_expiry FROM drivers WHERE id = ?").get(driver_id) as { license_expiry: string };
    if (new Date(driver.license_expiry) < new Date()) {
      return res.status(400).json({ error: "Driver license has expired" });
    }

    const result = db.prepare("INSERT INTO trips (vehicle_id, driver_id, cargo_weight, origin, destination, estimated_fuel_cost, revenue, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Dispatched')").run(
      vehicle_id, driver_id, cargo_weight, origin, destination, estimated_fuel_cost, revenue || 0
    );
    
    // Update status
    db.prepare("UPDATE vehicles SET status = 'On Trip' WHERE id = ?").run(vehicle_id);
    db.prepare("UPDATE drivers SET status = 'On Duty' WHERE id = ?").run(driver_id);

    res.json({ id: result.lastInsertRowid });
  });

  // Mark Trip as Completed
  app.post("/api/trips/:id/complete", (req, res) => {
    const { id } = req.params;
    try {
      const trip = db.prepare("SELECT * FROM trips WHERE id = ?").get(id) as { vehicle_id: number, driver_id: number, status: string };
      
      if (!trip) return res.status(404).json({ error: "Trip not found" });
      if (trip.status === 'Completed') return res.status(400).json({ error: "Trip already completed" });

      db.transaction(() => {
        db.prepare("UPDATE trips SET status = 'Completed' WHERE id = ?").run(id);
        db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(trip.vehicle_id);
        db.prepare("UPDATE drivers SET status = 'Off Duty' WHERE id = ?").run(trip.driver_id);
      })();

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Maintenance Log
  app.get("/api/maintenance", (req, res) => {
    const logs = db.prepare(`
      SELECT maintenance_logs.*, vehicles.name as vehicle_name 
      FROM maintenance_logs 
      JOIN vehicles ON maintenance_logs.vehicle_id = vehicles.id
      ORDER BY date DESC
    `).all();
    res.json(logs);
  });

  app.post("/api/maintenance", (req, res) => {
    const { vehicle_id, description, date } = req.body;
    const result = db.prepare("INSERT INTO maintenance_logs (vehicle_id, description, date, status) VALUES (?, ?, ?, 'Pending')").run(vehicle_id, description, date);
    db.prepare("UPDATE vehicles SET status = 'In Shop' WHERE id = ?").run(vehicle_id);
    res.json({ id: result.lastInsertRowid });
  });

  // Complete Maintenance
  app.post("/api/maintenance/:id/complete", (req, res) => {
    const { id } = req.params;
    try {
      const log = db.prepare("SELECT * FROM maintenance_logs WHERE id = ?").get(id) as { vehicle_id: number, status: string };
      
      if (!log) return res.status(404).json({ error: "Log not found" });
      if (log.status === 'Completed') return res.status(400).json({ error: "Maintenance already completed" });

      db.transaction(() => {
        db.prepare("UPDATE maintenance_logs SET status = 'Completed' WHERE id = ?").run(id);
        db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(log.vehicle_id);
      })();

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Expenses
  app.get("/api/expenses", (req, res) => {
    const expenses = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
    res.json(expenses);
  });

  app.post("/api/expenses", (req, res) => {
    const { trip_id, driver_name, fuel_cost, misc_expense } = req.body;
    const result = db.prepare("INSERT INTO expenses (trip_id, driver_name, fuel_cost, misc_expense) VALUES (?, ?, ?, ?)").run(trip_id, driver_name, fuel_cost, misc_expense);
    res.json({ id: result.lastInsertRowid });
  });

  // Analytics
  app.get("/api/analytics/summary", (req, res) => {
    try {
      // Check if we have any data
      const tripsCount = db.prepare("SELECT COUNT(*) as count FROM trips").get() as { count: number };
      const expensesCount = db.prepare("SELECT COUNT(*) as count FROM expenses").get() as { count: number };

      let summary;

      if (tripsCount.count === 0 && expensesCount.count === 0) {
        // Return mock data if no real data exists
        summary = [
          { month: 'Jan', revenue: 4500000, fuel_cost: 1200000, maintenance: 350000, net_profit: 2950000 },
          { month: 'Feb', revenue: 5200000, fuel_cost: 1400000, maintenance: 420000, net_profit: 3380000 },
          { month: 'Mar', revenue: 4800000, fuel_cost: 1300000, maintenance: 380000, net_profit: 3120000 }
        ];
      } else {
        // Calculate from real data
        summary = db.prepare(`
          SELECT 
            strftime('%Y-%m', date) as month_key,
            SUM(revenue) as revenue,
            SUM(fuel_cost) as fuel_cost,
            SUM(maintenance) as maintenance
          FROM (
            SELECT created_at as date, IFNULL(revenue, 0) as revenue, 0 as fuel_cost, 0 as maintenance FROM trips
            UNION ALL
            SELECT date, 0, IFNULL(fuel_cost, 0) + IFNULL(misc_expense, 0), 0 FROM expenses
            UNION ALL
            SELECT date, 0, 0, IFNULL(cost, 0) FROM maintenance_logs
          )
          WHERE date IS NOT NULL
          GROUP BY strftime('%Y-%m', date)
          ORDER BY date ASC
          LIMIT 6
        `).all().map((row: any) => ({
          month: new Date(row.month_key + '-01').toLocaleString('default', { month: 'short' }),
          revenue: row.revenue || 0,
          fuel_cost: row.fuel_cost || 0,
          maintenance: row.maintenance || 0,
          net_profit: (row.revenue || 0) - (row.fuel_cost || 0) - (row.maintenance || 0)
        }));
      }

      res.json(summary);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  const startServerOnPort = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", (e: any) => {
      if (e.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServerOnPort(port + 1);
      } else {
        console.error(e);
      }
    });
  };

  startServerOnPort(PORT);
}

startServer();
