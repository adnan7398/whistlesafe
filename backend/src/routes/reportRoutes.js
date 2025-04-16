const express = require('express');
const router = express.Router();
const { createReport, getReport, updateReportStatus } = require('../controllers/reportController');
const { authenticateAdmin } = require('../middleware/auth');

// Create report (public route)
router.post('/', createReport);

// Get report (protected route)
router.get('/:id', authenticateAdmin, getReport);

// Update report status (protected route)
router.patch('/:id/status', authenticateAdmin, updateReportStatus);

module.exports = router; 