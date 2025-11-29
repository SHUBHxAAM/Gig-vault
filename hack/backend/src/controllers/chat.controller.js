const ChatMessage = require("../models/Chat");

// Fetch messages for a room (contractId)
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ roomId }).sort({ createdAt: 1 }).limit(100);
    res.json({ messages });
  } catch (err) {
    console.error("getMessages err:", err);
    res.status(500).json({ message: "server error" });
  }
};

// (Optional REST endpoint if you want to post message via HTTP)
// Note: primary chat path uses Socket.IO, but this is handy for seeding/testing.
exports.postMessage = async (req, res) => {
  try {
    const { roomId, text } = req.body;
    if (!roomId || !text) return res.status(400).json({ message: "Missing fields" });

    const msg = await ChatMessage.create({
      roomId,
      sender: req.user.id,
      text,
      createdAt: new Date()
    });

    res.json({ message: msg });
  } catch (err) {
    console.error("postMessage err:", err);
    res.status(500).json({ message: "server error" });
  }
};
