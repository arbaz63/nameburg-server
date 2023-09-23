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
      // selectedExtension,
      // allowedExtensions,
      nameFilter,
      category,
      sort,
    } = req;

    //filter by keywords
    if (keywords.length > 0 && !keywords.includes('All')) {
      console.log('keyword')
      query = query.find({ keywords: { $in: keywords } });
    }

    // //filter by min and max price
    if (!isNaN(minPrice)) {
      console.log('minprice')
      query = query.find({ currentPrice: { $gte: minPrice } });
    }

    if (!isNaN(maxPrice)) {
      console.log('maxprice')
      query = query.find({ currentPrice: { $lte: maxPrice } });
    }

    //filter by min and max length
    // if (!isNaN(minLength)) {
    //   console.log('minLength')
    //   query = query.find({ name: { $gte: minLength } });
    // }

    // if (!isNaN(maxLength)) {
    //   console.log('maxLength')
    //   query = query.find({ name: { $lte: maxLength } });
    // }

    //filter by min and max length
    // if (!isNaN(minLength)) {
    //   console.log('minlength')
    //   query = query.find({ $where: `this.name.length >= ${minLength}` });
    // }

    // if (!isNaN(maxLength)) {
    //   console.log('maxlength')
    //   query = query.find({ $where: `this.name.length <= ${maxLength}` });
    // }

    if (!isNaN(minLength) || !isNaN(maxLength)) {
      console.log('minlength maxlength')
      query = query.find({
        name: { $exists: true },
        $expr: {
          $and: [
            { $gte: [{ $strLenCP: "$name" }, minLength] },
            { $lte: [{ $strLenCP: "$name" }, maxLength||100] },
          ],
        },
      });
    }

    //filter by extensions
    // if (
    //   selectedExtension !== "All" &&
    //   allowedExtensions.includes(selectedExtension)
    // ) {
    //   query = query.find({ name: { $regex: `${selectedExtension}$` } });
    // }

    // //sorting
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

    // if (
    //   selectedExtension !== "All" &&
    //   allowedExtensions.includes(selectedExtension)
    // ) {
    //   totalDomainsQuery = totalDomainsQuery.find({
    //     name: { $regex: `${selectedExtension}$` },
    //   });
    // }

    // if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    //   totalDomainsQuery = totalDomainsQuery.find({
    //     currentPrice: { $exists: true },
    //     $expr: {
    //       $and: [
    //         { $gte: [{ $strLenCP: "$currentPrice" }, minPrice] },
    //         { $lte: [{ $strLenCP: "$currentPrice" }, maxPrice] },
    //       ],
    //     },
    //   });
    // }

    if (!isNaN(minPrice)) {
      totalDomainsQuery = totalDomainsQuery.find({ currentPrice: { $gte: minPrice } });
    }

    if (!isNaN(maxPrice)) {
      totalDomainsQuery = totalDomainsQuery.find({ currentPrice: { $lte: maxPrice } });
    }

    // if (!isNaN(minLength)) {
    //   totalDomainsQuery = totalDomainsQuery.find({ name: { $gte: minLength } });
    // }

    // if (!isNaN(maxLength)) {
    //   totalDomainsQuery = totalDomainsQuery.find({ name: { $lte: maxLength } });
    // }

    if (!isNaN(minLength) || !isNaN(maxLength)) {
      totalDomainsQuery = totalDomainsQuery.find({
        name: { $exists: true },
        $expr: {
          $and: [
            { $gte: [{ $strLenCP: "$name" }, minLength] },
            { $lte: [{ $strLenCP: "$name" }, maxLength||100] },
          ],
        },
      });
    }

    if (nameFilter) {
      totalDomainsQuery = totalDomainsQuery.find({ name: { $regex: nameFilter, $options: "i" } });
    }

    if (category) {
      totalDomainsQuery = totalDomainsQuery.find({ category: category });
    }

    req.query = query;
    req.totalDomainsQuery = totalDomainsQuery;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching domains" });
  }
};

const checkNameAvailability = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  
  try {
    const existingDomain = await Domain.findOne({ name });
    
    if (existingDomain && existingDomain._id.toString() !== id) {
      return res.status(400).json({ error: "Name already taken" });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = {
  handleFilters,
  applyFilters,
  checkNameAvailability
};
