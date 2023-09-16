const express = require("express");
const router = express.Router();
const { stripeController } = require("../controllers");
const { isAdmin, authenticateToken } = require("../middlewares");

router.post("/checkout", authenticateToken, stripeController.stripeCheckout);
router.post("/payment",  stripeController.payment);

module.exports = router;
