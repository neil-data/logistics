// src/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public read access, restricted write access
router.get('/', authenticate, vehicleController.getVehicles);
router.get('/:id', authenticate, vehicleController.getVehicleById);

// Only Managers and Dispatchers can modify fleet
router.post('/', authenticate, authorize(['MANAGER', 'DISPATCHER']), vehicleController.createVehicle);
router.put('/:id', authenticate, authorize(['MANAGER', 'DISPATCHER']), vehicleController.updateVehicle);
router.delete('/:id', authenticate, authorize(['MANAGER']), vehicleController.deleteVehicle);

module.exports = router;
