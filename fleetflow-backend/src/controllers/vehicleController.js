// src/controllers/vehicleController.js
const vehicleService = require('../services/vehicleService');
const { z } = require('zod');

// Zod Schemas
const createVehicleSchema = z.object({
  name: z.string().min(1),
  licensePlate: z.string().min(1),
  type: z.string().optional(),
  maxCapacity: z.number().positive(),
  odometer: z.number().nonnegative().optional(),
  acquisitionCost: z.number().nonnegative().optional(),
  region: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional()
});

const updateVehicleSchema = createVehicleSchema.partial();

const getVehicles = async (req, res, next) => {
  try {
    const filters = req.query;
    const vehicles = await vehicleService.getAllVehicles(filters);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const data = createVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.createVehicle(data);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.updateVehicle(id, data);
    res.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
