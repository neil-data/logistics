// src/controllers/analyticsController.js
const prisma = require('../config/prisma');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      activeFleet,
      maintenanceAlerts,
      pendingCargo
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
      prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
      prisma.trip.count({ where: { status: 'DRAFT' } })
    ]);

    const utilizationRate = totalVehicles > 0 
      ? Math.round((activeFleet / totalVehicles) * 100) 
      : 0;

    res.json({
      totalVehicles,
      activeFleet,
      maintenanceAlerts,
      utilizationRate,
      pendingCargo
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleAnalytics = async (req, res, next) => {
  try {
    // Advanced: Calculate ROI per vehicle
    // ROI = (Revenue - (Fuel + Maintenance + Acquisition/Depreciation)) / Acquisition
    
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
            where: { status: 'COMPLETED' }
        },
        maintenanceLogs: true,
        fuelLogs: true
      }
    });

    const analytics = vehicles.map(v => {
      const totalRevenue = v.trips.reduce((sum, t) => sum + (t.revenue || 0), 0);
      const fuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const maintenanceCost = v.maintenanceLogs.reduce((sum, m) => sum + (m.cost || 0), 0);
      
      // Simple ROI Calculation (Revenue - OpEx)
      const operationalCost = fuelCost + maintenanceCost;
      const profit = totalRevenue - operationalCost;

      return {
        id: v.id,
        name: v.name,
        revenue: totalRevenue,
        operationalCost,
        profit,
        fuelEfficiency: "N/A" // Needs distance/liters logic
      };
    });

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getVehicleAnalytics };
