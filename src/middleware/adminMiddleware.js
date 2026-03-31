const adminOnly = (req, res, next) => {
  if (`${req.user?.role ?? ""}`.trim().toLowerCase() !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  return next();
};

module.exports = adminOnly;
