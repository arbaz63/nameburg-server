const express = require("express");
const router = express.Router();
const { purchaseController } = require("../controllers");
const { isAdmin, authenticateToken } = require("../middlewares");

// Get all purchases
router.get("/", authenticateToken, isAdmin, purchaseController.getAllPurchases);

// Get all purchases of user
router.get("/buyer/:buyerId", authenticateToken, purchaseController.getAllPurchasesOfUser);

// Get purchase by ID
router.get(
  "/:id",
  authenticateToken,
  purchaseController.getSinglePurchase
);

// Create a new purchase
router.post("/", authenticateToken, purchaseController.createNewPurchase);

module.exports = router;
