const mongoose = require("mongoose");

const Product = require("../models/Product");
const Shop = require("../models/Shop");
const User = require("../models/User");
const { isApprovedShopKyc } = require("./shopKycService");
const { mapPublicUser, mapPublicShopSummary } = require("../utils/publicUserProfileMapper");

const getPublicUserProfile = async ({ userId, baseUrl } = {}) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid user id");
    error.status = 400;
    throw error;
  }

  const [user, shop] = await Promise.all([
    User.findById(userId).lean(),
    Shop.findOne({ owner: userId }).lean(),
  ]);

  if (!user) {
    const error = new Error("Public profile not found");
    error.status = 404;
    throw error;
  }

  let publicShop = null;
  if (isApprovedShopKyc(shop)) {
    const [availableProductsCount, soldProductsCount] = await Promise.all([
      Product.countDocuments({
        seller: userId,
        status: "available",
      }),
      Product.countDocuments({
        seller: userId,
        status: "sold",
      }),
    ]);

    publicShop = mapPublicShopSummary(shop, {
      baseUrl,
      availableProductsCount,
      soldProductsCount,
    });
  }

  return {
    profile: {
      user: mapPublicUser(user, baseUrl),
      shop: publicShop,
    },
    message: "Public profile loaded successfully",
  };
};

module.exports = {
  getPublicUserProfile,
};
