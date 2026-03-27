export class User {
  constructor({ id, name, email, avatarUrl, phone, address } = {}) {
    this.id = id ?? "";
    this.name = name ?? "";
    this.email = email ?? "";
    this.avatarUrl = avatarUrl ?? "";
    this.phone = phone ?? "";
    this.address = address ?? "";
  }

  static fromJSON(json) {
    return new User({
      id: json.id ?? json._id,
      name: json.name,
      email: json.email,
      avatarUrl: json.avatarUrl,
      phone: json.phone,
      address: json.address,
    });
  }

  toEditablePayload() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  withEditablePatch(patch = {}) {
    return new User({
      ...this,
      ...patch,
    });
  }
}
