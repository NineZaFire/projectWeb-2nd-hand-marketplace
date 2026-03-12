export class ShopProfile {
  constructor({ id, ownerId, shopName, description, contact, avatarUrl } = {}) {
    this.id = id ?? "";
    this.ownerId = ownerId ?? "";
    this.shopName = shopName ?? "";
    this.description = description ?? "";
    this.contact = contact ?? "";
    this.avatarUrl = avatarUrl ?? "";
  }

  static fromJSON(json) {
    return new ShopProfile({
      id: json?.id ?? json?._id,
      ownerId: json?.ownerId,
      shopName: json?.shopName,
      description: json?.description,
      contact: json?.contact,
      avatarUrl: json?.avatarUrl,
    });
  }

  toPayload() {
    return {
      shopName: this.shopName,
      description: this.description,
      contact: this.contact,
      avatarUrl: this.avatarUrl,
    };
  }
}
