import { Server } from "socket.io";
import { withEdge } from '@vercel/edge';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket server is already running");
  } else {
    console.log("Starting socket server...");
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Server is Connected");

      socket.on('join-room', (roomId, userId) => {
        console.log(`a new user ${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);
      });
      
      socket.on('user-toggle-audio', (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
      });

      socket.on('user-toggle-video', (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-video", userId);
      });

      socket.on('user-leave', (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-leave', userId);
      });
    });
  }
  res.end();
};

export default SocketHandler;
