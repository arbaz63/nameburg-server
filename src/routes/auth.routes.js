const express = require("express");
const {
  validate,
  checkEmailAvailability,
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

router.put(
  "/:id",
  userCredentialsValidationRules(),
  validate,
  authController.updateUser
);

module.exports = router;
