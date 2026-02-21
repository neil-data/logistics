// src/routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, maintenanceController.getMaintenanceLogs);
router.post('/', authenticate, authorize(['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']), maintenanceController.createMaintenance);
router.post('/:id/complete', authenticate, authorize(['MANAGER', 'DISPATCHER']), maintenanceController.completeMaintenance);

module.exports = router;
