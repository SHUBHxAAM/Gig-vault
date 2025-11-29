const mongoose = require("mongoose");

const EscrowSchema = new mongoose.Schema({
  contractId: { type: String, required: true, index: true }, // your internal contract reference
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  amount: { type: Number, required: true }, // amount in paisa (integer)
  currency: { type: String, default: "INR" },

  // escrow status lifecycle
  status: {
    type: String,
    enum: ["pending", "locked", "submitted", "released", "refunded", "disputed"],
    default: "pending"
  },

  // Razorpay fields (optional — populated when using Razorpay)
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  razorpayTransferId: { type: String, default: null }, // payout id if used

  // deliverable (worker uploads)
  deliverableUrl: { type: String, default: "" },
  deliverableNote: { type: String, default: "" },

  // history/logs: action, actor (userId or system), note, ts
  history: [
    {
      action: String,
      actor: { type: String, default: "system" },
      note: String,
      ts: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// update updatedAt on save
EscrowSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Escrow", EscrowSchema);
