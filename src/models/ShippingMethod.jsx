const safeText = (value) => `${value ?? ""}`.trim().toLowerCase();

export class ShippingMethod {
  static MEETUP = "meetup";
  static PARCEL = "parcel";

  static normalize(value) {
    const normalized = safeText(value);
    if (normalized === ShippingMethod.PARCEL) return ShippingMethod.PARCEL;
    return ShippingMethod.MEETUP;
  }

  static list() {
    return [ShippingMethod.MEETUP, ShippingMethod.PARCEL];
  }

  static isMeetup(value) {
    return ShippingMethod.normalize(value) === ShippingMethod.MEETUP;
  }

  static isParcel(value) {
    return ShippingMethod.normalize(value) === ShippingMethod.PARCEL;
  }

  static getLabel(value) {
    if (ShippingMethod.isParcel(value)) return "ส่งพัสดุ";
    return "นัดรับ";
  }
}
