const authMiddleware = require("./auth.middleware");
const validate = require("./validator.middleware");
const isAdmin = require("./isAdmin.middleware");

module.exports = {
  ...authMiddleware,
  ...validate,
  ...isAdmin,
};
