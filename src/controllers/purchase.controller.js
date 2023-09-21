/* eslint-disable no-underscore-dangle */
const db = require("../models");
require("dotenv").config();

const { Purchase } = db;

const getAllPurchases = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page from query parameter
  const limit = parseInt(req.query.limit) || 20; // Set a default limit or get from query parameter

  try {
    const totalPurchases = await Purchase.countDocuments();
    const totalPages = Math.ceil(totalPurchases / limit);

    const purchases = await Purchase.find()
      .populate({
        path: "buyer",
        select: "fullName email",
      })
      .populate("domains")
      .skip((page - 1) * limit) // Skip the appropriate number of documents based on page number
      .limit(limit); // Limit the number of documents per page

    res.json({
      purchases,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchases" });
  }
};

const getAllPurchasesOfUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page from query parameter
  const limit = parseInt(req.query.limit) || 20; // Set a default limit or get from query parameter

  try {
    const totalPurchases = await Purchase.countDocuments();
    const totalPages = Math.ceil(totalPurchases / limit);

    const purchases = await Purchase.find({ buyer: req.params.buyerId })
      .populate({
        path: "buyer",
        select: "fullName email",
      })
      .populate("domains")
      .skip((page - 1) * limit) // Skip the appropriate number of documents based on page number
      .limit(limit); // Limit the number of documents per page

    res.json({
      purchases,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchases" });
  }
};

const getSinglePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate({
        path: "buyer",
        select: "fullName email",
      })
      .populate("domains");
    if (!purchase) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchase" });
  }
};

const createNewPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();
    res.json(savedPurchase);
  } catch (error) {
    res.status(400).json({ message: "Error creating purchase" });
  }
};

module.exports = {
  getAllPurchases,
  getAllPurchasesOfUser,
  getSinglePurchase,
  createNewPurchase,
};
