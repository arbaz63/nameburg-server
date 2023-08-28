const express = require("express");
const {
  validate,
  checkEmailAvailability,
  isAdmin,
  authenticateToken,
} = require("../middlewares");
const { userCredentialsValidationRules } = require("../validators");

const { authController } = require("../controllers");

const router = express.Router();
router.post(
  "/signup",
  checkEmailAvailability,
  userCredentialsValidationRules(),
  validate,
  authController.signUp
);

router.post(
  "/signin",
  userCredentialsValidationRules(),
  validate,
  authController.signIn
);

router.get("/admin", authenticateToken, isAdmin, (req, res) => {
  res.json({ message: "Admin-only route" });
});

module.exports = router;
