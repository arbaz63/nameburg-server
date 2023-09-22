const express = require("express");
const router = express.Router();
const { domainController } = require("../controllers");
const {
  authenticateToken,
  isAdmin,
  handleFilters,
  applyFilters,
  checkNameAvailability,
} = require("../middlewares");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all domain names
router.get("/", handleFilters, applyFilters, domainController.getDomains);

//Route to get single domain
router.get("/:id", domainController.getDomain);

// Route to create a new domain
router.post(
  "/",
  authenticateToken,
  isAdmin,
  checkNameAvailability,
  upload.single("image"),
  domainController.addDomain
);

// Route to update a domain
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  checkNameAvailability,
  domainController.editDomain
);

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
