const authController = require("./auth.controller");
const domainController = require("./domain.controller");
const categoryController = require("./category.controller");
const purchaseController = require("./purchase.controller");
const stripeController = require("./stripe.controller");
const invoiceController = require("./invoice.controller");

module.exports = {
  authController,
  domainController,
  categoryController,
  purchaseController,
  stripeController,
  invoiceController
};
