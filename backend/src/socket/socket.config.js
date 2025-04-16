const { Server } = require('socket.io');

const userSockets = {};
const adminSockets = {};

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('register_user', (uuid) => {
      userSockets[uuid] = socket.id;
      console.log(`User ${uuid} registered with socket ${socket.id}`);
    });

    socket.on('register_admin', (adminId) => {
      adminSockets[adminId] = socket.id;
      console.log(`Admin ${adminId} registered with socket ${socket.id}`);
    });

    // New report notification
    socket.on('new_report', (reportData) => {
      // Notify assigned admin
      if (reportData.assignedAdmin && adminSockets[reportData.assignedAdmin]) {
        io.to(adminSockets[reportData.assignedAdmin]).emit('report_assigned', reportData);
      }
      
      // Notify super admin for monitoring
      io.emit('report_created', {
        reportId: reportData.reportId,
        category: reportData.category,
        timestamp: new Date()
      });
    });

    // Status update notification
    socket.on('status_update', (data) => {
      // Notify user about status change
      if (data.userUUID && userSockets[data.userUUID]) {
        io.to(userSockets[data.userUUID]).emit('report_status_changed', {
          reportId: data.reportId,
          status: data.status
        });
      }
      
      // Log status change for super admin
      io.emit('status_change_log', {
        reportId: data.reportId,
        status: data.status,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      // Clean up user sockets
      Object.keys(userSockets).forEach(uuid => {
        if (userSockets[uuid] === socket.id) {
          delete userSockets[uuid];
        }
      });

      // Clean up admin sockets
      Object.keys(adminSockets).forEach(adminId => {
        if (adminSockets[adminId] === socket.id) {
          delete adminSockets[adminId];
        }
      });
    });
  });

  return {
    io,
    userSockets,
    adminSockets
  };
};

module.exports = { initializeSocket }; 