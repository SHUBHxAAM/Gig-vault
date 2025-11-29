const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { authMiddleware } = require("../middleware/auth");

// Create Razorpay order
router.post("/create-order", authMiddleware, paymentController.createOrder);

// Razorpay webhook (public endpoint)
router.post("/webhook", express.json({ type: "application/json" }), paymentController.webhookHandler);

// Refund payment (admin or client)
router.post("/refund", authMiddleware, paymentController.refundPayment);

module.exports = router;
