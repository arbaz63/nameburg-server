const db = require("../models");

const { Domain } = db;

// Middleware to handle query parameters and filtering
const handleFilters = (req, res, next) => {
  req.page = parseInt(req.query.page) || 1;
  req.limit = parseInt(req.query.limit) || 20;
  req.keywords = req.query.keywords ? req.query.keywords.split(",") : [];
  req.minPrice = parseFloat(req.query.minPrice);
  req.maxPrice = parseFloat(req.query.maxPrice);
  req.minLength = parseInt(req.query.minLength);
  req.maxLength = parseInt(req.query.maxLength);
  req.allowedExtensions = ["All", ".com", ".io", ".ly", ".me"];
  req.selectedExtension = req.query.extension || "All";
  req.sort = req.query.sort || "low-high";
  req.nameFilter = req.query.searchTerm;
  req.category = req.query.category;
  next();
};

// Middleware to apply filters to the query
const applyFilters = async (req, res, next) => {
  try {
    let query = Domain.find().populate("category");
    const {
      keywords,
      minLength,
      minPrice,
      maxLength,
      maxPrice,
      selectedExtension,
      allowedExtensions,
      nameFilter,
      category,
      sort,
    } = req;

    //filter by keywords
    if (keywords.length > 0) {
      query = query.find({ keywords: { $in: keywords } });
    }

    //filter by min and max price
    if (!isNaN(minPrice)) {
      query = query.find({ currentPrice: { $gte: minPrice } });
    }

    if (!isNaN(maxPrice)) {
      query = query.find({ currentPrice: { $lte: maxPrice } });
    }

    //filter by min and max length
    if (!isNaN(minLength)) {
      query = query.find({ $where: `this.name.length >= ${minLength}` });
    }

    if (!isNaN(maxLength)) {
      query = query.find({ $where: `this.name.length <= ${maxLength}` });
    }

    //filter by extensions
    if (
      selectedExtension !== "All" &&
      allowedExtensions.includes(selectedExtension)
    ) {
      query = query.find({ name: { $regex: `${selectedExtension}$` } });
    }

    //sorting
    if (sort === "low-high") {
      query = query.sort({ currentPrice: 1 });
    } else if (sort === "high-low") {
      query = query.sort({ currentPrice: -1 });
    }

    //search by name
    if (nameFilter) {
      query = query.find({ name: { $regex: nameFilter, $options: "i" } });
    }

    //filter by category
    if (category) {
      query = query.find({ category: category });
    }

    //Calculate total pages
    let totalDomainsQuery = Domain.find();

    if (keywords.length > 0) {
      totalDomainsQuery = totalDomainsQuery.find({
        keywords: { $in: keywords },
      });
    }

    if (
      selectedExtension !== "All" &&
      allowedExtensions.includes(selectedExtension)
    ) {
      totalDomainsQuery = totalDomainsQuery.find({
        name: { $regex: `${selectedExtension}$` },
      });
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      totalDomainsQuery = totalDomainsQuery.find({
        currentPrice: { $exists: true },
        $expr: {
          $and: [
            { $gte: [{ $strLenCP: "$currentPrice" }, minLength] },
            { $lte: [{ $strLenCP: "$currentPrice" }, maxLength] },
          ],
        },
      });
    }

    if (!isNaN(minLength) || !isNaN(maxLength) || nameFilter || category) {
      totalDomainsQuery = totalDomainsQuery.find({
        name: { $exists: true },
        $expr: {
          $and: [
            { $gte: [{ $strLenCP: "$name" }, minLength] },
            { $lte: [{ $strLenCP: "$name" }, maxLength] },
            {
              $regexMatch: {
                input: "$name",
                regex: nameFilter,
                options: "i",
              },
            },
            { $eq: ["$category", category] },
          ],
        },
      });
    }

    req.query = query;
    req.totalDomainsQuery = totalDomainsQuery;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching domains" });
  }
};

module.exports = {
  handleFilters,
  applyFilters,
};
