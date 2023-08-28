const isAdmin = (req, res, next) => {
  const user = req.user;
  console.log(user);
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = { isAdmin };
