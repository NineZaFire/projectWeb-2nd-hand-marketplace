const express = require("express");

const { getStorefrontByOwnerId } = require("../controllers/storefrontController");

const router = express.Router();

router.get("/shops/owner/:ownerId/storefront", getStorefrontByOwnerId);
router.get("/sellers/:ownerId/storefront", getStorefrontByOwnerId);

module.exports = router;
