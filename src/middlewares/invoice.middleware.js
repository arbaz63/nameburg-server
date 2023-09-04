const db = require("../models");

const { Domain } = db;

// Check if the provided domain names exist in the Domain model
const checkInvalidDomainName = async (req, res, next) => {
  const { domains } = req.body;
  const invalidDomains = [];

  for (const domain of domains) {
    const existingDomain = await Domain.findOne({ name: domain.domainname });
    if (!existingDomain) {
      invalidDomains.push(domain.domainname);
    }
  }

  // Filter out null values (valid domains) from the invalidDomains array
  const invalidDomainNames = invalidDomains.filter(
    (domainName) => domainName !== null
  );

  if (invalidDomainNames.length > 0) {
    return res.status(400).json({
      message: "Invalid domain names",
      invalidDomains: invalidDomainNames,
    });
  }
  next()
};

module.exports = {
  checkInvalidDomainName,
};
