const cloudinary = require('cloudinary').v2;
const Media = require('../schemas/Media');
const { encryptText } = require('../utils/encryption');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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

    // Create media record with encrypted metadata
    const media = await Media.create({
      url: result.secure_url,
      type: result.resource_type,
      tags: result.tags || [],
      metadata: {
        exif: result.exif ? encryptText(JSON.stringify(result.exif)) : null,
        timestamp: new Date()
      },
      uploadedBy: req.body.uuid,
      linkedReport: req.body.reportId
    });

    res.json({
      success: true,
      media: {
        id: media._id,
        url: media.url,
        type: media.type
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete from Cloudinary
    const publicId = media.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`whistlesafe_media/${publicId}`);

    // Delete from database
    await Media.findByIdAndDelete(mediaId);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

module.exports = {
  uploadMedia,
  deleteMedia
}; 