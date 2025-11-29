const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to sign JWT (or use utils/generateToken.js if present)
const signToken = (user) => {
  const payload = { id: user._id, role: user.role, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "7d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashed = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone: phone || "",
      passwordHash: hashed,
      role: role || "client",
      walletBalance: 0
    });

    const token = signToken(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("register err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error("login err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    console.error("me err:", err);
    res.status(500).json({ message: "Server error" });
  }
};
