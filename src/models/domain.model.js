// models/domain.js
const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  maxPrice: Number, // Maximum price for the domain
  minPrice: Number, // Minimum price for the domain
  currentPrice: {
    type: Number,
    default: 0,
  }, // Current price for the domain (updated weekly)
  weeksOnSale: {
    // track of how many weeks the domain has been on sale
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Boolean,
    default: false, // Set the default value to false
  },
  keywords: [{ type: String }],
  date: { type: Date, default: Date.now },
});

const Domain = mongoose.model("Domain", domainSchema);

module.exports = Domain;
