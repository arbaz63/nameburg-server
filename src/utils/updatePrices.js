const db = require("../models");
require("dotenv").config();

const { Domain } = db;

const updatePrice = async (req, res) => {
  try {
    const domains = await Domain.find();
    const currentDate = new Date();
    console.log('prices updated')

    // Loop through each domain and update its price based on the pricing logic
    domains.forEach(async (domain) => {
      const maxPrice = domain.maxPrice;
      const minPrice = domain.minPrice;
      const currentPrice = domain.currentPrice || maxPrice;
      const step = Math.floor((maxPrice - minPrice) / 52);
      const weekInMillis = 7 * 24 * 60 * 60 * 1000; // A week in milliseconds
      const domainAgeInMillis = currentDate - domain.date;

      // Check if at least a week has passed since the domain was created
      if (domainAgeInMillis >= weekInMillis) {
        const newPrice = Math.max(currentPrice - step, minPrice);
        if (domain.weeksOnSale >= 52) {
          domain.currentPrice = maxPrice;
          domain.weeksOnSale = 0;
        } else {
          domain.currentPrice = newPrice;
          domain.weeksOnSale += 1;
        }
        await domain.save();
      }
    });

  } catch (error) {
    console.error("Error updating domain prices:", error);
  }
};

module.exports = updatePrice