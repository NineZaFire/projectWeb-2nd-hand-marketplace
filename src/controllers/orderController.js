const {
  listOrdersForBuyer,
  updateBuyerShopOrderDecision,
  listSellerParcelPaymentReviews,
  updateSellerParcelPaymentReviewDecision,
  updateSellerParcelShipment,
} = require("../services/orderService");

const getMyOrders = async (req, res) => {
  try {
    const orders = await listOrdersForBuyer({
      req,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while fetching orders",
    });
  }
};

const decideBuyerShopOrder = async (req, res) => {
  try {
    const result = await updateBuyerShopOrderDecision({
      req,
      userId: req.user.id,
      orderId: req.params.orderId,
      shopOrderKey: req.params.shopOrderKey,
      action: req.body?.action,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      order: result.order,
      updatedOrder: result.order,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while updating order",
    });
  }
};

const getSellerParcelPaymentReviews = async (req, res) => {
  try {
    const reviews = await listSellerParcelPaymentReviews({
      req,
      ownerId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while fetching payment reviews",
    });
  }
};

const decideSellerParcelPaymentReview = async (req, res) => {
  try {
    const result = await updateSellerParcelPaymentReviewDecision({
      req,
      ownerId: req.user.id,
      orderId: req.params.orderId,
      shopOrderKey: req.params.shopOrderKey,
      action: req.body?.action,
      note: req.body?.note ?? req.body?.reason,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      order: result.order,
      updatedOrder: result.order,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while updating payment review",
    });
  }
};

const updateSellerParcelShipmentStatus = async (req, res) => {
  try {
    const result = await updateSellerParcelShipment({
      req,
      ownerId: req.user.id,
      orderId: req.params.orderId,
      shopOrderKey: req.params.shopOrderKey,
      action: req.body?.action,
      trackingNumber: req.body?.trackingNumber,
      carrier: req.body?.carrier,
      note: req.body?.note,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      order: result.order,
      updatedOrder: result.order,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while updating parcel shipment",
    });
  }
};

module.exports = {
  getMyOrders,
  decideBuyerShopOrder,
  getSellerParcelPaymentReviews,
  decideSellerParcelPaymentReview,
  updateSellerParcelShipmentStatus,
};
