const Report = require('../schemas/Report');
const { encryptText, decryptText } = require('../utils/encryption');
const { getLocationDetails, validateCoordinates } = require('../utils/geolocation');
const { assignReportToAdmin } = require('../utils/adminAssigner');
const { io } = require('../socket');

const createReport = async (req, res) => {
  try {
    const { description, category, latitude, longitude, mediaIds } = req.body;
    const userUUID = req.user?.uuid || req.body.uuid;

    // Validate coordinates
    if (!validateCoordinates(latitude, longitude)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    // Get location details
    const location = await getLocationDetails(latitude, longitude);

    // Encrypt sensitive data
    const encryptedDescription = encryptText(description);

    // Create report
    const report = await Report.create({
      userUUID,
      category,
      description: encryptedDescription,
      location,
      media: mediaIds || [],
      status: 'pending'
    });

    // Auto-assign to admin
    const assignedReport = await assignReportToAdmin(report._id);

    // Notify relevant parties via socket
    io.emit('new_report', {
      reportId: report._id,
      category: report.category,
      location: report.location,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      report: {
        id: report._id,
        category: report.category,
        status: report.status,
        location: report.location,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Decrypt description for authorized users
    const decryptedDescription = decryptText(report.description);

    res.json({
      success: true,
      report: {
        ...report.toObject(),
        description: decryptedDescription
      }
    });
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({ error: 'Failed to get report' });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Notify user about status update
    io.to(report.userUUID).emit('status_update', {
      reportId: report._id,
      status: report.status
    });

    res.json({
      success: true,
      report: {
        id: report._id,
        status: report.status
      }
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
};

module.exports = {
  createReport,
  getReport,
  updateReportStatus
}; 