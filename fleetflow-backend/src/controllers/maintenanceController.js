// src/controllers/maintenanceController.js
const prisma = require('../config/prisma');
const { z } = require('zod');

const maintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  description: z.string().min(1),
  cost: z.number().nonnegative().optional()
});

const createMaintenance = async (req, res, next) => {
  try {
    const data = maintenanceSchema.parse(req.body);
    
    // Transaction: Create Log & Update Vehicle Status
    const result = await prisma.$transaction(async (prisma) => {
      const log = await prisma.maintenanceLog.create({
        data: {
          ...data,
          status: 'Pending'
        }
      });
      
      await prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'IN_SHOP' }
      });
      
      return log;
    });
    
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

const completeMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const log = await prisma.maintenanceLog.findUnique({ where: { id } });
    if (!log) return res.status(404).json({ error: 'Log not found' });
    
    const result = await prisma.$transaction(async (prisma) => {
      const updatedLog = await prisma.maintenanceLog.update({
        where: { id },
        data: { status: 'Completed' }
      });
      
      await prisma.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: 'AVAILABLE' }
      });
      
      return updatedLog;
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceLogs = async (req, res, next) => {
    try {
        const logs = await prisma.maintenanceLog.findMany({
            include: { vehicle: true },
            orderBy: { date: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        next(error);
    }
}

module.exports = { createMaintenance, completeMaintenance, getMaintenanceLogs };
