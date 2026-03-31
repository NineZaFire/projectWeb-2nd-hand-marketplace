const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getMyOrders,
  decideBuyerShopOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/me", protect, getMyOrders);
router.post("/:orderId/shop-orders/:shopOrderKey/decision", protect, decideBuyerShopOrder);

module.exports = router;
