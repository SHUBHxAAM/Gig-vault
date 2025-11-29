const Escrow = require("../models/Escrow");
const User = require("../models/User");

// Create contract + escrow placeholder (client will pay via Razorpay order afterwards)
exports.createContract = async (req, res) => {
  try {
    const { contractId, workerEmail, amount, description } = req.body;
    if (!contractId || !workerEmail || !amount) return res.status(400).json({ message: "Missing fields" });

    const worker = await User.findOne({ email: workerEmail });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const escrow = await Escrow.create({
      contractId,
      clientId: req.user.id,
      workerId: worker._id,
      amount: Math.round(Number(amount) * 100), // store in paisa
      history: [{ action: "CONTRACT_CREATED", actor: req.user.id, note: description || "" }]
    });

    res.json({ escrow });
  } catch (err) {
    console.error("createContract err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contracts for client
exports.getClientContracts = async (req, res) => {
  try {
    const escrows = await Escrow.find({ clientId: req.user.id }).populate("workerId", "name email trustScore");
    res.json({ escrows });
  } catch (err) {
    console.error("getClientContracts err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get contracts for worker
exports.getWorkerContracts = async (req, res) => {
  try {
    const escrows = await Escrow.find({ workerId: req.user.id }).populate("clientId", "name email");
    res.json({ escrows });
  } catch (err) {
    console.error("getWorkerContracts err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single escrow
exports.getEscrow = async (req, res) => {
  try {
    const escrow = await Escrow.findById(req.params.id).populate("clientId workerId", "name email");
    if (!escrow) return res.status(404).json({ message: "Not found" });
    res.json({ escrow });
  } catch (err) {
    console.error("getEscrow err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Worker submits deliverable URL (file upload handled elsewhere)
exports.submitWork = async (req, res) => {
  try {
    const { deliverableUrl, note } = req.body;
    const escrow = await Escrow.findById(req.params.id);
    if (!escrow) return res.status(404).json({ message: "Escrow not found" });

    // only worker assigned can submit
    if (String(escrow.workerId) !== String(req.user.id)) return res.status(403).json({ message: "Not authorized" });

    escrow.deliverableUrl = deliverableUrl || escrow.deliverableUrl;
    escrow.deliverableNote = note || escrow.deliverableNote;
    escrow.status = "submitted";
    escrow.history.push({ action: "WORK_SUBMITTED", actor: req.user.id, note: note || "" });

    await escrow.save();
    res.json({ escrow });
  } catch (err) {
    console.error("submitWork err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Client approves -> mark released (actual payout later)
exports.approveRelease = async (req, res) => {
  try {
    const escrow = await Escrow.findById(req.params.id);
    if (!escrow) return res.status(404).json({ message: "Escrow not found" });

    // only client (or admin) can release
    if (String(escrow.clientId) !== String(req.user.id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (escrow.status !== "locked" && escrow.status !== "submitted")
      return res.status(400).json({ message: `Cannot release from status ${escrow.status}` });

    escrow.status = "released";
    escrow.history.push({ action: "ESCROW_RELEASED", actor: req.user.id, note: req.body.note || "" });
    await escrow.save();

    // (optional) update trustScore for worker
    const worker = await User.findById(escrow.workerId);
    if (worker) {
      worker.trustScore = Math.min(100, (worker.trustScore || 70) + 10);
      await worker.save();
    }

    res.json({ escrow, message: "Escrow released. Do payout to worker (manual or automated)." });
  } catch (err) {
    console.error("approveRelease err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Raise dispute
exports.raiseDispute = async (req, res) => {
  try {
    const { reason } = req.body;
    const escrow = await Escrow.findById(req.params.id);
    if (!escrow) return res.status(404).json({ message: "Escrow not found" });

    escrow.status = "disputed";
    escrow.history.push({ action: "DISPUTE_RAISED", actor: req.user.id, note: reason || "" });
    await escrow.save();
    res.json({ escrow, message: "Dispute raised. Admin will review." });
  } catch (err) {
    console.error("raiseDispute err:", err);
    res.status(500).json({ message: "Server error" });
  }
};
