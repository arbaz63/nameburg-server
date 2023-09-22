/* eslint-disable no-underscore-dangle */
const db = require("../models");
require("dotenv").config();

const { Domain } = db;

const getDomains = async (req, res) => {
  try {
    const totalDomains = await req.totalDomainsQuery.countDocuments();
    const totalPages = Math.ceil(totalDomains / req.limit);

    const domains = await req.query
      .skip((req.page - 1) * req.limit)
      .limit(req.limit);

    res.json({
      domains,
      currentPage: req.page,
      totalPages,
      totalDomains
    });
  } catch (error) {
    console.error(error);
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
    const imageBuffer = req.file && req.file.buffer;
    const imageURL = imageBuffer && "data:image/jpeg;base64," + imageBuffer.toString("base64")
    const newDomain = new Domain({...req.body, image:imageURL||''});
    await newDomain.save();
    res.status(201).json(newDomain);
  } catch (error) {
    res.status(400).json({ message: `Error creating domain ${error}` });
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
    const imageBuffer = req.file && req.file.buffer;
    const imageURL = imageBuffer && "data:image/jpeg;base64," + imageBuffer.toString("base64");
    const updatedDomain = await Domain.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageURL || '' },
      { new: true }
    );

    res.json(updatedDomain);
  } catch (error) {
    res.status(400).json({ message: "Error updating domain" });
  }
};


const incrementViews = async (req, res) => {
  try {
    const domain = await Domain.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment view count by 1
      { new: true } // To return the updated document
    );

    if (!domain) {
      res.status(404).json({ message: "Domain not found" });
      return;
    }

    res.json({ message: "View count incremented" });
  } catch (error) {
    res.status(500).json({ message: "Error updating view count" });
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
  resetPrice,
};
