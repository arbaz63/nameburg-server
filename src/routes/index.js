const express = require("express");
const authRoute = require("./auth.routes");
const domainRoute = require("./domain.routes");
const categoryRoute = require("./category.routes");
const purchaseRoute = require("./purchase.routes");

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/domains",
    route: domainRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/purchases",
    route: purchaseRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
