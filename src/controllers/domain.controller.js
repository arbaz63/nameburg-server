/* eslint-disable no-underscore-dangle */
const db = require("../models");
require("dotenv").config();

const { Domain } = db;

const getDomains = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page from query parameter
  const limit = parseInt(req.query.limit) || 20; // Set a default limit or get from query parameter

  try {
    const totalDomains = await Domain.countDocuments();
    const totalPages = Math.ceil(totalDomains / limit);

    const domains = await Domain.find()
      .populate("category")
      .skip((page - 1) * limit) // Skip the appropriate number of documents based on page number
      .limit(limit); // Limit the number of documents per page

    res.json({
      domains,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching domains" });
  }
};

const getDomain = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id).populate("category");
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }
    res.json(domain);
  } catch (error) {
    res.status(500).json({ message: "Error fetching domain" });
  }
};

const addDomain = async (req, res) => {
  try {
    const newDomain = new Domain(req.body);
    await newDomain.save();
    res.status(201).json(newDomain);
  } catch (error) {
    res.status(400).json({ message: "Error creating domain" });
  }
};

const deleteDomain = async (req, res) => {
  try {
    await Domain.findByIdAndDelete(req.params.id);
    res.json({ message: "Domain deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting domain" });
  }
};

const editDomain = async (req, res) => {
  try {
    const updatedDomain = await Domain.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDomain);
  } catch (error) {
    res.status(400).json({ message: "Error updating domain" });
  }
};

const incrementViews = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404).json({ message: "Domain not found" });
      return;
    }
    domain.views += 1; // Increment view count
    await domain.save();
    res.json({ message: "View count incremented" });
  } catch (error) {
    res.status(400).json({ message: "Error updating view count" });
  }
};

const resetPrice = async (req, res) => {
  const { id } = req.params;

  try {
    const domain = await Domain.findById(id);

    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Calculate the new price and update the domain's fields
    domain.currentPrice = domain.maxPrice;
    await domain.save();

    return res.status(200).json({ message: "Price reset successful", domain });
  } catch (error) {
    console.error("Error resetting domain price:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDomains,
  getDomain,
  addDomain,
  deleteDomain,
  editDomain,
  incrementViews,
  resetPrice
};
