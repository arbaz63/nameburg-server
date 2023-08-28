const express = require("express");
const router = express.Router();
const { domainController } = require("../controllers");
const { authenticateToken, isAdmin } = require("../middlewares");

// Route to get all domain names
router.get("/", domainController.getDomains);

//Route to get single domain
router.get("/:id", domainController.getDomain);

// Route to create a new domain
router.post("/", authenticateToken, isAdmin, domainController.addDomain);

// Route to update a domain
router.put("/:id", authenticateToken, isAdmin, domainController.editDomain);

// Route to delete a domain
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  domainController.deleteDomain
);

// Increment view count for a domain by ID
router.put("/:id/increment-views", domainController.incrementViews);

//Route to reset domain price anytime
router.post(
    "/reset-price/:id",
    authenticateToken,
    isAdmin,
    domainController.resetPrice
  );

module.exports = router;
