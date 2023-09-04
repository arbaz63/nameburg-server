const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = { isAdmin };
