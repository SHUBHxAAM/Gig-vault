const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true }, // typically contractId
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, trim: true, default: "" },
  attachments: [{ type: String }], // URLs (S3/local) if any
  type: { type: String, enum: ["text", "file", "system"], default: "text" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
