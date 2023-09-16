const express = require("express");
const router = express.Router();
const { stripeController } = require("../controllers");
const { authenticateToken } = require("../middlewares");

router.post("/checkout", authenticateToken, stripeController.stripeCheckout);
router.post("/payment", authenticateToken,  stripeController.payment);

module.exports = router;
