const mongoose = require("mongoose");

const Product = require("../models/Product");
const Shop = require("../models/Shop");
const User = require("../models/User");
const { mapStorefrontProduct, mapStorefrontShop } = require("../utils/storefrontMapper");
const { isApprovedShopKyc } = require("./shopKycService");

const getStorefrontByOwnerId = async ({ ownerId, baseUrl } = {}) => {
  if (!mongoose.isValidObjectId(ownerId)) {
    const error = new Error("Invalid owner id");
    error.status = 400;
    throw error;
  }

  const [owner, shop, products, soldProductsCount] = await Promise.all([
    User.findById(ownerId).lean(),
    Shop.findOne({ owner: ownerId }).lean(),
    Product.find({
      seller: ownerId,
      status: "available",
    })
      .sort({ createdAt: -1 })
      .lean(),
    Product.countDocuments({
      seller: ownerId,
      status: "sold",
    }),
  ]);

  if (!owner && !shop) {
    const error = new Error("Seller storefront not found");
    error.status = 404;
    throw error;
  }

  if (!isApprovedShopKyc(shop)) {
    const error = new Error("Seller storefront not found");
    error.status = 404;
    throw error;
  }

  return {
    storefront: {
      shop: {
        ...mapStorefrontShop(shop, owner, baseUrl),
        availableProductsCount: products.length,
        soldProductsCount,
      },
      products: products.map((product) => mapStorefrontProduct(product, shop, owner, baseUrl)),
    },
    message: "Storefront loaded successfully",
  };
};

module.exports = {
  getStorefrontByOwnerId,
};
