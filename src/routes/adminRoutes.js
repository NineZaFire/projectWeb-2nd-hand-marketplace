const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getDashboardSummary,
  listMembers,
  listProducts,
  deleteProduct,
  reviewMember,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");
const {
  listReports,
  reviewReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardSummary);
router.get("/members", protect, adminOnly, listMembers);
router.get("/products", protect, adminOnly, listProducts);
router.delete("/products/:productId", protect, adminOnly, deleteProduct);
router.post("/members/:memberId/decision", protect, adminOnly, reviewMember);
router.get("/reports", protect, adminOnly, listReports);
router.post("/reports/:reportId/decision", protect, adminOnly, reviewReport);
router.get("/categories", protect, adminOnly, listCategories);
router.post("/categories", protect, adminOnly, createCategory);
router.patch("/categories/:categoryId", protect, adminOnly, updateCategory);
router.delete("/categories/:categoryId", protect, adminOnly, deleteCategory);

module.exports = router;
