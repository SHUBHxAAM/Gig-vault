const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const { initChatSocket } = require("./sockets/chat.socket");

const PORT = process.env.PORT || 5000;

// Start server
const server = http.createServer(app);

// Socket.IO setup
initChatSocket(server);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err));
