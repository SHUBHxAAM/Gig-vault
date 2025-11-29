const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { authMiddleware } = require("../middleware/auth");

// Fetch chat messages for a room/contract
router.get("/:roomId", authMiddleware, chatController.getMessages);

// Optional: post message via REST
router.post("/", authMiddleware, chatController.postMessage);

module.exports = router;
