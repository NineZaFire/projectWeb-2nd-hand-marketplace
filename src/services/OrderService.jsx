import { HttpClient } from "./HttpClient";
import { MyOrder } from "../models/MyOrder";

export class OrderService {
  static #instance = null;

  static instance() {
    if (!OrderService.#instance) OrderService.#instance = new OrderService();
    return OrderService.#instance;
  }

  constructor() {
    this.http = new HttpClient({ baseUrl: import.meta.env.VITE_API_URL ?? "" });
  }

  // โครง backend: GET /api/orders/me (ดึงคำสั่งซื้อของผู้ใช้ปัจจุบันจาก database)
  async listMyOrders() {
    const result = await this.http.get("/api/orders/me");
    const orders = Array.isArray(result?.orders)
      ? result.orders.map((item) => MyOrder.fromJSON(item))
      : [];

    return { orders };
  }
}
