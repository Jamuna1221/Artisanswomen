const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: `Role '${req.admin.role}' is not allowed to access this route` });
    }
    next();
  };
};

module.exports = { authorizeRoles };
