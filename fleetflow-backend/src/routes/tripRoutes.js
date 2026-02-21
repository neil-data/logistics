// src/routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, tripController.getTrips);
router.post('/', authenticate, authorize(['MANAGER', 'DISPATCHER']), tripController.createTrip);
router.post('/:id/complete', authenticate, authorize(['MANAGER', 'DISPATCHER']), tripController.completeTrip);

module.exports = router;
