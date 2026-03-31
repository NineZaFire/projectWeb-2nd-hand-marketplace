const adminService = require("../services/adminService");

const getApiBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

const handleAdminError = (res, error, fallbackMessage) => {
  const statusCode = Number(error?.statusCode) || 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? fallbackMessage : error.message,
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

const getDashboardSummary = async (req, res) => {
  try {
    const summary = await adminService.getDashboardSummary();
    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while fetching admin dashboard");
  }
};

const listMembers = async (req, res) => {
  try {
    const members = await adminService.listMembers({ baseUrl: getApiBaseUrl(req) });
    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while fetching admin members");
  }
};

const listProducts = async (req, res) => {
  try {
    const result = await adminService.listProducts({
      baseUrl: getApiBaseUrl(req),
      search: req.query?.q ?? req.query?.search ?? "",
    });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while fetching admin products");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await adminService.deleteProductByAdmin({
      productId: req.params.productId,
      note: req.body?.note ?? req.body?.reason ?? "",
      baseUrl: getApiBaseUrl(req),
    });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while deleting admin product");
  }
};

const reviewMember = async (req, res) => {
  try {
    const result = await adminService.reviewMemberDecision({
      memberId: req.params.memberId,
      action: req.body?.action,
      note: req.body?.note ?? req.body?.reason ?? "",
      shopId: req.body?.shopId ?? "",
      baseUrl: getApiBaseUrl(req),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while reviewing member");
  }
};

const listCategories = async (req, res) => {
  try {
    const result = await adminService.listCategories();
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while fetching admin categories");
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await adminService.createCategory(req.body ?? {});
    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while creating category");
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await adminService.updateCategory({
      categoryId: req.params.categoryId,
      ...(req.body ?? {}),
    });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while updating category");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await adminService.deleteCategory({
      categoryId: req.params.categoryId,
    });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleAdminError(res, error, "Server error while deleting category");
  }
};

module.exports = {
  getDashboardSummary,
  listMembers,
  listProducts,
  deleteProduct,
  reviewMember,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
