const express = require("express");
const {
  validate,
  checkEmailAvailability,
} = require("../middlewares");
const { userCredentialsValidationRules, userCredentialsValidationRules1 } = require("../validators");

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
  userCredentialsValidationRules1(),
  validate,
  authController.updateUser
);

module.exports = router;
