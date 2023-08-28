const jwt = require("jsonwebtoken");

const db = require("../models");

const { User } = db;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const checkEmailAvailability = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already taken" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  authenticateToken,
  checkEmailAvailability,
};
