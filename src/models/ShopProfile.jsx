const safeText = (value) => `${value ?? ""}`.trim();

export class ShopProfile {
  constructor({ id, ownerId, shopName, description, contact, avatarUrl, parcelQrCodeUrl } = {}) {
    this.id = id ?? "";
    this.ownerId = ownerId ?? "";
    this.shopName = shopName ?? "";
    this.description = description ?? "";
    this.contact = contact ?? "";
    this.avatarUrl = avatarUrl ?? "";
    this.parcelQrCodeUrl = parcelQrCodeUrl ?? "";
  }

  static fromJSON(json) {
    return new ShopProfile({
      id: json?.id ?? json?._id,
      ownerId: json?.ownerId,
      shopName: json?.shopName,
      description: json?.description,
      contact: json?.contact,
      avatarUrl: json?.avatarUrl,
      parcelQrCodeUrl:
        json?.parcelQrCodeUrl ?? json?.paymentQrCodeUrl ?? json?.parcelPaymentQrCodeUrl ?? json?.qrCodeUrl,
    });
  }

  static empty() {
    return new ShopProfile();
  }

  withPatch(patch = {}) {
    return new ShopProfile({
      ...this,
      ...patch,
    });
  }

  hasParcelQrCode() {
    return Boolean(safeText(this.parcelQrCodeUrl));
  }

  toPayload() {
    return {
      shopName: this.shopName,
      description: this.description,
      contact: this.contact,
      avatarUrl: this.avatarUrl,
      parcelQrCodeUrl: this.parcelQrCodeUrl,
    };
  }
}
