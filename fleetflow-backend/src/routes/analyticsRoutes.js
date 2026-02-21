// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.get('/vehicle-performance', authenticate, authorize(['MANAGER', 'ANALYST']), analyticsController.getVehicleAnalytics);

module.exports = router;
