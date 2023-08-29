const express = require("express");
const router = express.Router();
const { categoryController } = require("../controllers");
const { authenticateToken, isAdmin } = require("../middlewares");

// Route to get all category names
router.get("/", categoryController.getCategories);

// Route to create a new category
router.post("/", authenticateToken, isAdmin, categoryController.addCategory);

// Route to update a category
router.put("/:id", authenticateToken, isAdmin, categoryController.editCategory);

// Route to delete a category
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
