const storefrontService = require("../services/storefrontService");

const getApiBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

const getStorefrontByOwnerId = async (req, res) => {
  try {
    const result = await storefrontService.getStorefrontByOwnerId({
      ownerId: req.params.ownerId,
      baseUrl: getApiBaseUrl(req),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const statusCode = Number(error?.status) || 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode >= 500 ? "Server error while fetching storefront" : error.message,
      ...(statusCode >= 500 ? { error: error.message } : {}),
    });
  }
};

module.exports = {
  getStorefrontByOwnerId,
};
