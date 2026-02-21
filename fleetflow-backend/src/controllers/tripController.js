// src/controllers/tripController.js
const tripService = require('../services/tripService');
const { z } = require('zod');

const createTripSchema = z.object({
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeight: z.number().positive(),
  estimatedFuelCost: z.number().nonnegative().optional(),
  origin: z.string().optional(),
  destination: z.string().optional()
});

const completeTripSchema = z.object({
  endOdo: z.number().nonnegative()
});

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips();
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const data = createTripSchema.parse(req.body);
    const trip = await tripService.createTrip(data);
    res.status(201).json(trip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = completeTripSchema.parse(req.body);
    const trip = await tripService.completeTrip(id, data);
    res.json(trip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    next(error);
  }
};

module.exports = {
  getTrips,
  createTrip,
  completeTrip
};
