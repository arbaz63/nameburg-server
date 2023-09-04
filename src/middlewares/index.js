const authMiddleware = require("./auth.middleware");
const validate = require("./validator.middleware");
const isAdmin = require("./isAdmin.middleware");
const domainMiddleware = require("./domain.middleware");
const invoiceMiddleware = require("./invoice.middleware");

module.exports = {
  ...authMiddleware,
  ...validate,
  ...isAdmin,
  ...domainMiddleware,
  ...invoiceMiddleware
};
