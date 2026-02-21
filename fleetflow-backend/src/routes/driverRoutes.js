// src/routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, driverController.getDrivers);
router.post('/', authenticate, authorize(['MANAGER', 'SAFETY_OFFICER']), driverController.createDriver);

module.exports = router;
