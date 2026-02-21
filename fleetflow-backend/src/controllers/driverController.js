// src/controllers/driverController.js
const driverService = require('../services/driverService');
const { z } = require('zod');

const createDriverSchema = z.object({
  name: z.string().min(1),
  licenseType: z.string().min(1),
  licenseExpiry: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
  }),
  safetyScore: z.number().min(0).max(100).optional(),
  status: z.enum(['ON_DUTY', 'OFF_DUTY', 'ON_TRIP', 'SUSPENDED']).optional()
});

const getDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    const data = createDriverSchema.parse(req.body);
    // Convert date string to Date object
    data.licenseExpiry = new Date(data.licenseExpiry);
    
    const driver = await driverService.createDriver(data);
    res.status(201).json(driver);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

module.exports = {
  getDrivers,
  createDriver
};
