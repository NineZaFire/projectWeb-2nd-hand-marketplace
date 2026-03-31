const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  submitProductReport,
  submitShopReport,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/products/:productId", protect, submitProductReport);
router.post("/shops/owner/:ownerId", protect, submitShopReport);

module.exports = router;
