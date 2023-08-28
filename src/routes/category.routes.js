const express = require("express");
const router = express.Router();
const { categoryController } = require("../controllers");
const { authenticateToken, isAdmin } = require("../middlewares");

// Route to get all domain names
router.get("/", categoryController.getCategories);

// Route to create a new domain
router.post("/", authenticateToken, isAdmin, categoryController.addCategory);

// Route to update a domain
router.put("/:id", authenticateToken, isAdmin, categoryController.editCategory);

// Route to delete a domain
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
