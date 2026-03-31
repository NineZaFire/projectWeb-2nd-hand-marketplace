const adminService = require("../services/adminService");

const listCategories = async (req, res) => {
  try {
    const categories = await adminService.listPublicCategories();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
      error: error.message,
    });
  }
};

module.exports = {
  listCategories,
};
