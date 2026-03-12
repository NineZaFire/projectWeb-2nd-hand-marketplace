export class User {
  constructor({
    id,
    name,
    email,
    avatarUrl,
    phone,
    address,
    // ข้อมูลจากบัตรประชาชน (ห้ามแก้)
    idCard,
  } = {}) {
    this.id = id ?? "";
    this.name = name ?? "";
    this.email = email ?? "";
    this.avatarUrl = avatarUrl ?? "";
    this.phone = phone ?? "";
    this.address = address ?? "";

    this.idCard = {
      citizenId: idCard?.citizenId ?? "",
      title: idCard?.title ?? "",
      firstName: idCard?.firstName ?? "",
      lastName: idCard?.lastName ?? "",
      dob: idCard?.dob ?? "",
    };
  }

  static fromJSON(json) {
    return new User({
      id: json.id ?? json._id,
      name: json.name,
      email: json.email,
      avatarUrl: json.avatarUrl,
      phone: json.phone,
      address: json.address,
      idCard: json.idCard,
    });
  }

  // ✅ ส่งเฉพาะฟิลด์ที่ "แก้ได้" ไปอัปเดต
  toEditablePayload() {
    return {
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      phone: this.phone,
      address: this.address,
    };
  }

  // ✅ update แบบ OOP (ไม่แตะ idCard)
  withEditablePatch(patch = {}) {
    return new User({
      ...this,
      ...patch,
      idCard: this.idCard, // lock
    });
  }
}