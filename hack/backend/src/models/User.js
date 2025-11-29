const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  passwordHash: { type: String, required: true },

  role: { type: String, enum: ["client", "worker", "admin"], default: "client" },

  // KYC and trust
  kycStatus: { type: String, enum: ["none", "pending", "verified", "rejected"], default: "none" },
  trustScore: { type: Number, default: 70, min: 0, max: 100 }, // 0 - 100
  banned: { type: Boolean, default: false },

  // Wallet / demo balance (for MVP simulation)
  walletBalance: { type: Number, default: 0 }, // store in smallest unit (paisa)

  createdAt: { type: Date, default: Date.now }
});

// Virtuals / instance helpers
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

module.exports = mongoose.model("User", UserSchema);
