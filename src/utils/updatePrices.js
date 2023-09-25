const db = require("../models");
require("dotenv").config();

const { Domain } = db;

const updatePrice = async (req, res) => {
  try {
    const domains = await Domain.find().select('name _id maxPrice minPrice currentPrice date weeksOnSale discount');
    const currentDate = new Date();
    // Loop through each domain and update its price based on the pricing logic
    domains.forEach(async (domain) => {
      const maxPrice = domain.maxPrice;
      const minPrice = domain.minPrice;
      const currentPrice = domain.currentPrice || maxPrice;
      const step = Math.floor((maxPrice - minPrice) / 52);
      const weekInMillis = 7 * 24 * 60 * 60 * 1000; // A week in milliseconds
      const domainAgeInMillis = currentDate - domain.date;
      const discount = ((maxPrice - currentPrice) / maxPrice) * 100;
      // Check if at least a week has passed since the domain was created
      if (domainAgeInMillis >= weekInMillis) {
        const newPrice = Math.max(currentPrice - step, minPrice);
        if (domain.weeksOnSale >= 52) {
          domain.currentPrice = maxPrice;
          domain.weeksOnSale = 0;
        } else {
          domain.currentPrice = newPrice;
          domain.weeksOnSale += 1;
          domain.discount = discount;
        }
        await domain.save();
      }
    });
    console.log('prices updates')
  } catch (error) {
    console.error("Error updating domain prices:", error);
  }
};

module.exports = updatePrice