const db = require("../models");

const { Category } = db;

const checkNameAvailability = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ error: "Name already taken" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  checkNameAvailability,
};
