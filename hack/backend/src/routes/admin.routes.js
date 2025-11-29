const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const User = require("../models/User");
const Escrow = require("../models/Escrow");

// Admin: get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json({ users });
});

// Admin: get all escrows
router.get("/escrows", authMiddleware, adminMiddleware, async (req, res) => {
  const escrows = await Escrow.find().populate("clientId workerId", "name email trustScore");
  res.json({ escrows });
});

// Admin: ban/unban user
router.post("/user/:id/ban", authMiddleware, adminMiddleware, async (req, res) => {
  const { ban } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.banned = ban;
  await user.save();
  res.json({ user, message: `User ${ban ? "banned" : "unbanned"}` });
});

module.exports = router;
