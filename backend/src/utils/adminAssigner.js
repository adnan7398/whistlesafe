const Admin = require('../schemas/Admin');
const Report = require('../schemas/Report');
const { userSockets, adminSockets, superAdminSockets } = require('../socket');

const findMatchingAdmins = async (category, location) => {
  try {
    // Find active admins matching both category and region
    const matchingAdmins = await Admin.find({
      isActive: true,
      assignedCategories: category,
      assignedRegions: location.region
    });

    if (matchingAdmins.length === 0) {
      // If no exact match, try finding admins matching either category or region
      const partialMatches = await Admin.find({
        isActive: true,
        $or: [
          { assignedCategories: category },
          { assignedRegions: location.region }
        ]
      });

      if (partialMatches.length === 0) {
        return [];
      }

      // Return admins sorted by workload
      return await sortAdminsByWorkload(partialMatches);
    }

    // Return admins sorted by workload
    return await sortAdminsByWorkload(matchingAdmins);
  } catch (error) {
    console.error('Error finding matching admins:', error);
    return [];
  }
};

const sortAdminsByWorkload = async (admins) => {
  try {
    const adminWorkloads = await Promise.all(
      admins.map(async (admin) => {
        const activeReports = await Report.countDocuments({
          assignedAdmin: admin._id,
          status: { $in: ['pending', 'in-review'] }
        });
        return { admin, workload: activeReports };
      })
    );

    // Sort by workload and return admins
    return adminWorkloads
      .sort((a, b) => a.workload - b.workload)
      .map(item => item.admin);
  } catch (error) {
    console.error('Error sorting admins by workload:', error);
    return admins;
  }
};

const assignReportToAdmin = async (reportId, admin) => {
  try {
    const report = await Report.findByIdAndUpdate(
      reportId,
      { 
        assignedAdmin: admin._id,
        status: 'in-review'
      },
      { new: true }
    );

    if (!report) {
      throw new Error('Report not found');
    }

    // Notify the assigned admin
    if (adminSockets.has(admin._id.toString())) {
      const io = require('../socket').io;
      io.to(adminSockets.get(admin._id.toString())).emit('new_assignment', {
        reportId: report._id,
        report: report
      });
    }

    // Log the assignment for super admin
    superAdminSockets.forEach(socketId => {
      const io = require('../socket').io;
      io.to(socketId).emit('assignment_log', {
        reportId: report._id,
        adminId: admin._id,
        timestamp: new Date()
      });
    });

    return report;
  } catch (error) {
    console.error('Error assigning report to admin:', error);
    throw error;
  }
};

module.exports = {
  findMatchingAdmins,
  assignReportToAdmin
}; 