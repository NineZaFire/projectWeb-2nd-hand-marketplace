import { ShopProduct } from "./ShopProduct";

export class CartItem {
  constructor({
    id,
    cartId,
    productId,
    ownerId,
    name,
    imageUrl,
    price,
    quantity,
    shopId,
    shopName,
    shopAvatarUrl,
    shopParcelQrCodeUrl,
    product,
  } = {}) {
    this.id = id ?? "";
    this.cartId = cartId ?? "";
    this.productId = productId ?? "";
    this.ownerId = ownerId ?? "";
    this.name = name ?? "";
    this.imageUrl = imageUrl ?? "";
    this.price = price ?? 0;
    this.quantity = Math.max(1, Number(quantity) || 1);
    this.shopId = shopId ?? "";
    this.shopName = shopName ?? "";
    this.shopAvatarUrl = shopAvatarUrl ?? "";
    this.shopParcelQrCodeUrl = shopParcelQrCodeUrl ?? "";
    this.product = product ? ShopProduct.fromJSON(product) : null;
  }

  static fromJSON(json) {
    const productJson = json?.product ?? json?.productData ?? null;
    const shopJson = json?.shop ?? null;
    const fallbackImage =
      productJson?.imageUrl ??
      productJson?.image ??
      (Array.isArray(productJson?.imageUrls) ? productJson.imageUrls[0] : "") ??
      "";

    return new CartItem({
      id: json?.id ?? json?._id ?? json?.cartItemId,
      cartId: json?.cartId,
      productId: json?.productId ?? productJson?.id ?? productJson?._id,
      ownerId: json?.ownerId ?? productJson?.ownerId ?? shopJson?.ownerId,
      name: json?.name ?? json?.productName ?? productJson?.name,
      imageUrl: json?.imageUrl ?? fallbackImage,
      price: json?.price ?? productJson?.price,
      quantity: json?.quantity ?? json?.qty ?? 1,
      shopId: json?.shopId ?? shopJson?.id,
      shopName: json?.shopName ?? shopJson?.shopName ?? shopJson?.name,
      shopAvatarUrl: json?.shopAvatarUrl ?? shopJson?.avatarUrl,
      shopParcelQrCodeUrl:
        json?.shopParcelQrCodeUrl ??
        shopJson?.parcelQrCodeUrl ??
        shopJson?.paymentQrCodeUrl ??
        shopJson?.qrCodeUrl,
      product: productJson,
    });
  }

  getPriceNumber() {
    const value = Number(this.price);
    if (!Number.isFinite(value) || value < 0) return 0;
    return value;
  }

  getLineTotalNumber() {
    return this.getPriceNumber() * this.quantity;
  }

  getPriceLabel() {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 2,
    }).format(this.getPriceNumber());
  }

  getLineTotalLabel() {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 2,
    }).format(this.getLineTotalNumber());
  }

  getShopKey() {
    return `${this.shopId || this.ownerId || "shop"}`.trim();
  }

  getShopName() {
    return `${this.shopName || "ร้านค้า"}`.trim();
  }

  hasParcelQrCode() {
    return Boolean(`${this.shopParcelQrCodeUrl ?? ""}`.trim());
  }

  toProductPayload() {
    const resolvedProduct = this.product ?? null;
    if (resolvedProduct) return resolvedProduct;

    return {
      id: this.productId,
      ownerId: this.ownerId,
      name: this.name,
      imageUrl: this.imageUrl,
      price: this.price,
    };
  }
}
