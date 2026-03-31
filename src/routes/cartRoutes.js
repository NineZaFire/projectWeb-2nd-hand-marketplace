const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  listMyCart,
  addCartItem,
  removeCartItemById,
  removeCartItemByProductId,
  checkoutCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", protect, listMyCart);
router.post("/items", protect, addCartItem);
router.delete("/items/:itemId", protect, removeCartItemById);
router.delete("/items/product/:productId", protect, removeCartItemByProductId);
router.post("/checkout", protect, upload.any(), checkoutCart);

module.exports = router;
