const express = require("express");
const router = express.Router();
const escrowController = require("../controllers/escrow.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Create contract / escrow
router.post("/create", authMiddleware, escrowController.createContract);

// Get contracts
router.get("/client", authMiddleware, escrowController.getClientContracts);
router.get("/worker", authMiddleware, escrowController.getWorkerContracts);
router.get("/:id", authMiddleware, escrowController.getEscrow);

// Submit work
router.post("/:id/submit", authMiddleware, escrowController.submitWork);

// Approve release
router.post("/:id/release", authMiddleware, escrowController.approveRelease);

// Raise dispute
router.post("/:id/dispute", authMiddleware, escrowController.raiseDispute);

module.exports = router;
