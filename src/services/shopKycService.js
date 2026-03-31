const Shop = require("../models/Shop");

const APPROVED_KYC_STATUS = "approved";

const isApprovedShopKyc = (shop) => `${shop?.kycStatus ?? ""}`.trim().toLowerCase() === APPROVED_KYC_STATUS;

const getApprovedShopOwnerIds = async () => {
  const ownerIds = await Shop.find({ kycStatus: APPROVED_KYC_STATUS }).distinct("owner");
  return ownerIds;
};

const findApprovedShopByOwnerId = async (ownerId) => {
  if (!ownerId) return null;
  return Shop.findOne({
    owner: ownerId,
    kycStatus: APPROVED_KYC_STATUS,
  });
};

const assertApprovedShopForSelling = async (ownerId) => {
  const approvedShop = await findApprovedShopByOwnerId(ownerId);
  if (approvedShop) return approvedShop;

  const existingShop = await Shop.findOne({ owner: ownerId });
  const error = new Error(
    existingShop
      ? "Your shop must be KYC approved before you can sell products"
      : "Please complete your shop profile and get KYC approval before selling products",
  );
  error.status = 403;
  error.code = "SHOP_KYC_REQUIRED";
  throw error;
};

module.exports = {
  APPROVED_KYC_STATUS,
  isApprovedShopKyc,
  getApprovedShopOwnerIds,
  findApprovedShopByOwnerId,
  assertApprovedShopForSelling,
};
