const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/my-products", protect, getMyProducts);
router.get("/:id", getProductById);

router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
