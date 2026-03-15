import { ShopProduct } from "./ShopProduct";

export class CartItem {
  constructor({
    id,
    cartId,
    productId,
    name,
    imageUrl,
    price,
    quantity,
    product,
  } = {}) {
    this.id = id ?? "";
    this.cartId = cartId ?? "";
    this.productId = productId ?? "";
    this.name = name ?? "";
    this.imageUrl = imageUrl ?? "";
    this.price = price ?? 0;
    this.quantity = Math.max(1, Number(quantity) || 1);
    this.product = product ? ShopProduct.fromJSON(product) : null;
  }

  static fromJSON(json) {
    const productJson = json?.product ?? json?.productData ?? null;
    const fallbackImage =
      productJson?.imageUrl ??
      productJson?.image ??
      (Array.isArray(productJson?.imageUrls) ? productJson.imageUrls[0] : "") ??
      "";

    return new CartItem({
      id: json?.id ?? json?._id ?? json?.cartItemId,
      cartId: json?.cartId,
      productId: json?.productId ?? productJson?.id ?? productJson?._id,
      name: json?.name ?? json?.productName ?? productJson?.name,
      imageUrl: json?.imageUrl ?? fallbackImage,
      price: json?.price ?? productJson?.price,
      quantity: json?.quantity ?? json?.qty ?? 1,
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

  toProductPayload() {
    const resolvedProduct = this.product ?? null;
    if (resolvedProduct) return resolvedProduct;

    return {
      id: this.productId,
      name: this.name,
      imageUrl: this.imageUrl,
      price: this.price,
    };
  }
}
