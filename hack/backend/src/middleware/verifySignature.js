const crypto = require("crypto");

// Verify Razorpay webhook signature
exports.verifyRazorpaySignature = (req, res, next) => {
  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(body).digest("hex");
    if (signature !== expected) return res.status(400).json({ ok: false, message: "Invalid signature" });
    next();
  } catch (err) {
    console.error("verifyRazorpaySignature err:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
