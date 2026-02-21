// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Currently auth is handled via middleware token verification, 
// no specific login route needed if using Firebase client-side login + token passing.
// We can add a "me" route to get current user details from DB.

const { authenticate } = require('../middleware/authMiddleware');
const prisma = require('../config/prisma');

router.get('/me', authenticate, async (req, res) => {
    res.json(req.dbUser);
});

module.exports = router;
