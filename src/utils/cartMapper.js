const Product = require("../models/Product");
const Shop = require("../models/Shop");

const mapProductForCart = (product, shop) => {
  if (!product) return null;

  return {
    id: product._id,
    ownerId: product.seller?.toString?.() ?? `${product.seller ?? ""}`,
    name: product.title,
    category: product.category,
    imageUrl: Array.isArray(product.images) && product.images.length ? product.images[0] : "",
    imageUrls: Array.isArray(product.images) ? product.images : [],
    price: product.price,
    exchangeItem: product.exchangeItem ?? "",
    description: product.description ?? "",
    saleStatus: product.status ?? "available",
    shopId: shop?._id ?? "",
    shopName: shop?.shopName ?? "",
    shopAvatarUrl: shop?.avatarUrl ?? "",
    createdAt: product.createdAt,
  };
};

const mapCartItem = ({ cartId, item, product, shop }) => {
  if (!item || !product) return null;

  const normalizedProduct = mapProductForCart(product, shop);
  return {
    id: item._id,
    cartId,
    productId: product._id,
    ownerId: product.seller?.toString?.() ?? `${product.seller ?? ""}`,
    name: product.title,
    imageUrl: normalizedProduct?.imageUrl ?? "",
    price: product.price,
    quantity: item.quantity,
    shopId: shop?._id ?? "",
    shopName: shop?.shopName ?? "",
    shopAvatarUrl: shop?.avatarUrl ?? "",
    shopParcelQrCodeUrl: shop?.parcelQrCodeUrl ?? "",
    shopBankName: shop?.bankName ?? "",
    shopBankAccountName: shop?.bankAccountName ?? "",
    shopBankAccountNumber: shop?.bankAccountNumber ?? "",
    product: normalizedProduct,
  };
};

const resolveCartContext = async (cart) => {
  if (!cart?.items?.length) {
    return {
      productsById: new Map(),
      shopsByOwnerId: new Map(),
    };
  }

  const productIds = cart.items.map((item) => item.product).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const sellerIds = [...new Set(products.map((product) => `${product.seller ?? ""}`).filter(Boolean))];
  const shops = sellerIds.length
    ? await Shop.find({ owner: { $in: sellerIds } }).lean()
    : [];

  return {
    productsById: new Map(products.map((product) => [product._id.toString(), product])),
    shopsByOwnerId: new Map(shops.map((shop) => [shop.owner.toString(), shop])),
  };
};

const buildCartPayload = async (cart, { persistMissingCleanup = false } = {}) => {
  if (!cart) {
    return {
      cartId: "",
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  const { productsById, shopsByOwnerId } = await resolveCartContext(cart);
  const nextItems = [];
  const validCartItems = [];

  for (const item of cart.items ?? []) {
    const product = productsById.get(item.product?.toString?.() ?? `${item.product ?? ""}`);
    if (!product) continue;

    validCartItems.push(item);
    const shop = shopsByOwnerId.get(product.seller?.toString?.() ?? `${product.seller ?? ""}`) ?? null;
    const mappedItem = mapCartItem({
      cartId: cart._id,
      item,
      product,
      shop,
    });
    if (mappedItem) nextItems.push(mappedItem);
  }

  if (persistMissingCleanup && validCartItems.length !== (cart.items ?? []).length) {
    cart.items = validCartItems;
    await cart.save();
  }

  return {
    cartId: cart._id,
    items: nextItems,
    totalItems: nextItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    totalPrice: nextItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    ),
  };
};

module.exports = {
  buildCartPayload,
  mapCartItem,
};
