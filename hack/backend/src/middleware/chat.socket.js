const { Server } = require("socket.io");
const ChatMessage = require("../models/Chat");

let io;

exports.initChatSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // restrict in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    // Send message
    socket.on("sendMessage", async ({ roomId, senderId, text }) => {
      const msg = await ChatMessage.create({ roomId, sender: senderId, text });
      io.to(roomId).emit("receiveMessage", msg);
    });

    // Leave room
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

exports.getIO = () => io;
