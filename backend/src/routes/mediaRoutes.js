const express = require('express');
const router = express.Router();
const { upload, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { authenticateAdmin } = require('../middleware/auth');

// Upload media (protected route)
router.post('/upload', authenticateAdmin, upload.single('media'), uploadMedia);

// Delete media (protected route)
router.delete('/:id', authenticateAdmin, deleteMedia);

module.exports = router; 