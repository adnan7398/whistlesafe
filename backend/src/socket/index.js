const socketIO = require('socket.io');
const Report = require('../schemas/Report');

// Store active connections
const userSockets = new Map(); // uuid -> socketId
const adminSockets = new Map(); // adminId -> socketId
const superAdminSockets = new Map(); // superAdminId -> socketId

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Register user socket
    socket.on('register_user', (uuid) => {
      userSockets.set(uuid, socket.id);
      console.log(`User ${uuid} registered with socket ${socket.id}`);
    });

    // Register admin socket
    socket.on('register_admin', (adminId) => {
      adminSockets.set(adminId, socket.id);
      console.log(`Admin ${adminId} registered with socket ${socket.id}`);
    });

    // Register super admin socket
    socket.on('register_superadmin', (superAdminId) => {
      superAdminSockets.set(superAdminId, socket.id);
      console.log(`SuperAdmin ${superAdminId} registered with socket ${socket.id}`);
    });

    // Handle new report submission
    socket.on('new_report', async (reportData) => {
      try {
        const report = await Report.findById(reportData.reportId);
        if (!report) return;

        // Notify relevant admins based on category and region
        const matchingAdmins = await findMatchingAdmins(report.category, report.location);
        matchingAdmins.forEach(admin => {
          if (adminSockets.has(admin._id.toString())) {
            io.to(adminSockets.get(admin._id.toString())).emit('new_report', reportData);
          }
        });

        // Notify super admins
        superAdminSockets.forEach(socketId => {
          io.to(socketId).emit('new_report_log', {
            reportId: report._id,
            timestamp: new Date()
          });
        });
      } catch (error) {
        console.error('Error handling new report:', error);
      }
    });

    // Handle report status updates
    socket.on('update_report_status', async (data) => {
      const { reportId, status, adminId } = data;
      
      try {
        const report = await Report.findById(reportId);
        if (!report) return;

        // Notify user about status update
        if (userSockets.has(report.userUUID)) {
          io.to(userSockets.get(report.userUUID)).emit('status_update', {
            reportId,
            status
          });
        }

        // Log the status update for super admin
        superAdminSockets.forEach(socketId => {
          io.to(socketId).emit('status_update_log', {
            reportId,
            status,
            adminId,
            timestamp: new Date()
          });
        });
      } catch (error) {
        console.error('Error updating report status:', error);
      }
    });

    // Handle new report assignment
    socket.on('assign_report', async (data) => {
      const { reportId, adminId } = data;
      
      // Notify assigned admin
      if (adminSockets.has(adminId)) {
        io.to(adminSockets.get(adminId)).emit('new_assignment', {
          reportId
        });
      }

      // Log assignment for super admin
      superAdminSockets.forEach((socketId) => {
        io.to(socketId).emit('assignment_log', {
          reportId,
          adminId,
          timestamp: new Date()
        });
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove from user sockets
      for (const [uuid, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(uuid);
          break;
        }
      }

      // Remove from admin sockets
      for (const [adminId, socketId] of adminSockets.entries()) {
        if (socketId === socket.id) {
          adminSockets.delete(adminId);
          break;
        }
      }

      // Remove from super admin sockets
      for (const [superAdminId, socketId] of superAdminSockets.entries()) {
        if (socketId === socket.id) {
          superAdminSockets.delete(superAdminId);
          break;
        }
      }

      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Helper function to find matching admins
const findMatchingAdmins = async (category, location) => {
  // Implementation will be added in the next step
  return [];
};

module.exports = {
  initializeSocket,
  userSockets,
  adminSockets,
  superAdminSockets
}; 