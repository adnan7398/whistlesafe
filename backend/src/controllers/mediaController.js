const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const Media = require('../schemas/Media');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'whistlesafe_media',
      use_filename: true,
      unique_filename: true
    });

    // Create media record in database
    const media = await Media.create({
      url: result.secure_url,
      type: result.resource_type,
      uploadedBy: req.body.uuid,
      linkedReport: req.body.reportId,
      metadata: {
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });

    // Clean up temporary file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      media: {
        id: media._id,
        url: media.url,
        type: media.type
      }
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.metadata.public_id);

    // Delete from database
    await Media.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

module.exports = {
  upload,
  uploadMedia,
  deleteMedia
}; 