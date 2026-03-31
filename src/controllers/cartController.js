const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { buildCartPayload, mapCartItem } = require("../utils/cartMapper");
const { createOrderFromCartCheckout } = require("../services/orderService");

const normalizeQuantity = (value) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 1) return 1;
  return Math.floor(parsedValue);
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }
  return cart;
};

const listMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const payload = await buildCartPayload(cart, { persistMissingCleanup: true });

    return res.status(200).json({
      success: true,
      ...payload,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
      error: error.message,
    });
  }
};

const addCartItem = async (req, res) => {
  try {
    const productId = `${req.body?.productId ?? ""}`.trim();
    const quantity = normalizeQuantity(req.body?.quantity);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (`${product.seller ?? ""}` === `${req.user.id}`) {
      return res.status(400).json({
        success: false,
        message: "You cannot add your own product to the cart",
      });
    }

    if (`${product.status ?? "available"}`.trim().toLowerCase() === "sold") {
      return res.status(400).json({
        success: false,
        message: "This product is already sold",
      });
    }

    const cart = await getOrCreateCart(req.user.id);
    const existingItem = cart.items.find((item) => `${item.product ?? ""}` === productId);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    const payload = await buildCartPayload(cart, { persistMissingCleanup: true });
    const item =
      payload.items.find((cartItem) => `${cartItem.productId ?? ""}` === productId) ?? null;

    return res.status(201).json({
      success: true,
      message: "Added product to cart successfully",
      cartId: payload.cartId,
      item,
      totalItems: payload.totalItems,
      totalPrice: payload.totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding product to cart",
      error: error.message,
    });
  }
};

const removeCartItemById = async (req, res) => {
  try {
    const itemId = `${req.params.itemId ?? ""}`.trim();
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item id",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const nextItems = (cart.items ?? []).filter((item) => item._id.toString() !== itemId);
    if (nextItems.length === cart.items.length) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = nextItems;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Removed product from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while removing cart item",
      error: error.message,
    });
  }
};

const removeCartItemByProductId = async (req, res) => {
  try {
    const productId = `${req.params.productId ?? ""}`.trim();
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const nextItems = (cart.items ?? []).filter((item) => `${item.product ?? ""}` !== productId);
    if (nextItems.length === cart.items.length) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = nextItems;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Removed product from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while removing cart item",
      error: error.message,
    });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const result = await createOrderFromCartCheckout({
      req,
      userId: req.user.id,
      body: req.body,
      files: req.files,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      orderId: result.order?.id ?? "",
      order: result.order,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error while checkout",
      error: error.status ? undefined : error.message,
    });
  }
};

module.exports = {
  listMyCart,
  addCartItem,
  removeCartItemById,
  removeCartItemByProductId,
  checkoutCart,
};
