import { ShippingMethod } from "./ShippingMethod";

const safeText = (value) => `${value ?? ""}`.trim();
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const ensureArray = (value) => (Array.isArray(value) ? value : value == null ? [] : [value]);

const formatCurrency = (value) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  }).format(toNumber(value, 0));

const formatDateTime = (value) => {
  const date = new Date(value ?? "");
  if (!safeText(value) || Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export class MyOrderItem {
  constructor({ itemId, productId, name, imageUrl, price, quantity } = {}) {
    this.itemId = itemId ?? "";
    this.productId = productId ?? "";
    this.name = name ?? "";
    this.imageUrl = imageUrl ?? "";
    this.price = toNumber(price, 0);
    this.quantity = Math.max(1, toNumber(quantity, 1));
  }

  static fromJSON(json) {
    return new MyOrderItem({
      itemId: json?.itemId ?? json?.id ?? json?._id,
      productId: json?.productId,
      name: json?.name ?? json?.productName,
      imageUrl: json?.imageUrl ?? json?.image,
      price: json?.price,
      quantity: json?.quantity ?? json?.qty,
    });
  }

  getLineTotalNumber() {
    return this.price * this.quantity;
  }

  getLineTotalLabel() {
    return formatCurrency(this.getLineTotalNumber());
  }

  getPriceLabel() {
    return formatCurrency(this.price);
  }
}

export class MyOrderShopOrder {
  constructor({
    ownerId,
    shopId,
    shopName,
    shippingMethod,
    status,
    items,
    subtotal,
    meetupProposal,
    parcelPayment,
    buyerShippingAddress,
  } = {}) {
    this.ownerId = ownerId ?? "";
    this.shopId = shopId ?? "";
    this.shopName = shopName ?? "ร้านค้า";
    this.shippingMethod = ShippingMethod.normalize(shippingMethod);
    this.status = status ?? "";
    this.items = ensureArray(items).map((item) =>
      item instanceof MyOrderItem ? item : MyOrderItem.fromJSON(item),
    );
    this.subtotal = toNumber(
      subtotal,
      this.items.reduce((sum, item) => sum + item.getLineTotalNumber(), 0),
    );
    this.meetupProposal = meetupProposal
      ? {
          location: safeText(meetupProposal.location),
          status: safeText(meetupProposal.status),
          proposedBy: safeText(meetupProposal.proposedBy),
          proposedAt: safeText(meetupProposal.proposedAt),
          responseLocation: safeText(meetupProposal.responseLocation),
          respondedBy: safeText(meetupProposal.respondedBy),
          respondedAt: safeText(meetupProposal.respondedAt),
        }
      : null;
    this.parcelPayment = parcelPayment
      ? {
          qrCodeUrl: safeText(parcelPayment.qrCodeUrl),
          receiptImageUrl: safeText(parcelPayment.receiptImageUrl),
          status: safeText(parcelPayment.status),
          submittedAt: safeText(parcelPayment.submittedAt),
        }
      : null;
    this.buyerShippingAddress = buyerShippingAddress
      ? {
          name: safeText(buyerShippingAddress.name),
          phone: safeText(buyerShippingAddress.phone),
          address: safeText(buyerShippingAddress.address),
        }
      : null;
  }

  static fromJSON(json) {
    const items = ensureArray(json?.items).map((item) => MyOrderItem.fromJSON(item));
    const buyerShippingAddress =
      json?.buyerShippingAddress && typeof json.buyerShippingAddress === "object"
        ? json.buyerShippingAddress
        : json?.shippingAddress && typeof json.shippingAddress === "object"
          ? json.shippingAddress
          : null;

    return new MyOrderShopOrder({
      ownerId: json?.ownerId,
      shopId: json?.shopId,
      shopName: json?.shopName,
      shippingMethod: json?.shippingMethod,
      status: json?.status,
      items,
      subtotal: json?.subtotal,
      meetupProposal: json?.meetupProposal,
      parcelPayment: json?.parcelPayment,
      buyerShippingAddress,
    });
  }

  getShippingMethodLabel() {
    return ShippingMethod.getLabel(this.shippingMethod);
  }

  getSubtotalLabel() {
    return formatCurrency(this.subtotal);
  }

  getStatusLabel() {
    switch (this.status) {
      case "pending_payment_verification":
        return "รอตรวจสอบสลิป";
      case "pending_seller_confirmation":
        return "รอยืนยันคำสั่งซื้อ";
      case "pending_meetup_response":
      case "pending_seller_response":
        return "รอตอบกลับจุดนัดรับ";
      case "awaiting_meetup":
        return "รอนัดพบ";
      case "countered_by_seller":
        return "คนขายเสนอจุดใหม่";
      case "cancelled_by_seller":
        return "ยกเลิกการนัดรับ";
      case "approved":
      case "accepted":
      case "confirmed":
      case "completed":
        return "ยืนยันแล้ว";
      case "rejected":
      case "cancelled":
        return "ถูกปฏิเสธ";
      default:
        return safeText(this.status) || "รอดำเนินการ";
    }
  }

  getRecipientLine() {
    if (!this.buyerShippingAddress) return "";
    return [this.buyerShippingAddress.name, this.buyerShippingAddress.phone]
      .filter(Boolean)
      .join(" | ");
  }
}

export class MyOrder {
  constructor({ id, userId, status, notes, items, totalPrice, createdAt, shopOrders } = {}) {
    this.id = id ?? "";
    this.userId = userId ?? "";
    this.status = status ?? "";
    this.notes = notes ?? "";
    this.items = ensureArray(items).map((item) =>
      item instanceof MyOrderItem ? item : MyOrderItem.fromJSON(item),
    );
    this.totalPrice = toNumber(
      totalPrice,
      this.items.reduce((sum, item) => sum + item.getLineTotalNumber(), 0),
    );
    this.createdAt = createdAt ?? "";
    this.shopOrders = ensureArray(shopOrders).map((shopOrder) =>
      shopOrder instanceof MyOrderShopOrder ? shopOrder : MyOrderShopOrder.fromJSON(shopOrder),
    );
  }

  static fromJSON(json) {
    const fallbackItems = ensureArray(json?.items).map((item) => MyOrderItem.fromJSON(item));
    const rawShopOrders =
      Array.isArray(json?.shopOrders) && json.shopOrders.length
        ? json.shopOrders
        : [
            {
              shopName: "คำสั่งซื้อ",
              shippingMethod: ShippingMethod.MEETUP,
              status: json?.status,
              items: fallbackItems,
              subtotal: json?.totalPrice,
            },
          ];

    return new MyOrder({
      id: json?.id ?? json?._id,
      userId: json?.userId,
      status: json?.status,
      notes: json?.notes,
      items: fallbackItems,
      totalPrice: json?.totalPrice,
      createdAt: json?.createdAt,
      shopOrders: rawShopOrders,
    });
  }

  getTotalPriceLabel() {
    return formatCurrency(this.totalPrice);
  }

  getCreatedAtLabel() {
    return formatDateTime(this.createdAt);
  }

  getStatusLabel() {
    switch (this.status) {
      case "pending_seller_action":
        return "รอร้านค้าดำเนินการ";
      case "awaiting_meetup":
        return "รอนัดพบ";
      case "countered_by_seller":
        return "คนขายเสนอจุดใหม่";
      case "cancelled_by_seller":
        return "ยกเลิกการนัดรับ";
      case "approved":
      case "accepted":
      case "confirmed":
      case "completed":
        return "เสร็จสิ้น";
      case "rejected":
      case "cancelled":
        return "ยกเลิก";
      default:
        return safeText(this.status) || "รอตรวจสอบ";
    }
  }
}
