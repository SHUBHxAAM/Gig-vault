const razorpay = require("../config/razorpay");
const Escrow = require("../models/Escrow");
const crypto = require("crypto");

// Create Razorpay order for a contract (client pays)
exports.createOrder = async (req, res) => {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ message: "Escrow not found" });

    // create razorpay order (amount already in paisa)
    const order = await razorpay.orders.create({
      amount: escrow.amount,
      currency: "INR",
      receipt: `rcpt_${escrow.contractId}_${Date.now()}`
    });

    // save order id to escrow
    escrow.razorpayOrderId = order.id;
    escrow.history.push({ action: "RAZORPAY_ORDER_CREATED", actor: "system", note: order.id });
    await escrow.save();

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("createOrder err:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Webhook to verify payment and lock escrow
exports.webhookHandler = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(body).digest("hex");

    if (expected !== signature) {
      console.warn("Invalid Razorpay signature");
      return res.status(400).json({ ok: false, message: "invalid signature" });
    }

    const event = req.body.event;
    // payment captured event
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      // find escrow by order id
      const escrow = await Escrow.findOne({ razorpayOrderId: payment.order_id });
      if (!escrow) {
        console.warn("Escrow not found for order", payment.order_id);
        return res.json({ ok: true });
      }

      // update escrow
      escrow.razorpayPaymentId = payment.id;
      escrow.status = "locked";
      escrow.history.push({ action: "PAYMENT_CAPTURED", actor: "razorpay", note: payment.id });
      await escrow.save();

      // (optional) notify parties via socket or email (left for frontend)
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("webhookHandler err:", err);
    res.status(500).json({ ok: false, message: "server error" });
  }
};

// (Optional) Refund via Razorpay API (requires secret privileges)
exports.refundPayment = async (req, res) => {
  try {
    const { escrowId, amount } = req.body;
    const escrow = await Escrow.findById(escrowId);
    if (!escrow || !escrow.razorpayPaymentId) return res.status(400).json({ message: "Invalid escrow" });

    // call Razorpay refund API
    const refund = await razorpay.payments.refund(escrow.razorpayPaymentId, { amount: amount || escrow.amount });
    escrow.status = "refunded";
    escrow.history.push({ action: "REFUNDED", actor: req.user.id || "admin", note: JSON.stringify(refund) });
    await escrow.save();

    res.json({ refund });
  } catch (err) {
    console.error("refundPayment err:", err);
    res.status(500).json({ message: "server error" });
  }
};
