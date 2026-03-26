import { HttpClient } from "./HttpClient";
import { ShopProfile } from "../models/ShopProfile";
import { ShopProduct } from "../models/ShopProduct";

export class MyShopService {
  static #instance = null;

  static instance() {
    if (!MyShopService.#instance) MyShopService.#instance = new MyShopService();
    return MyShopService.#instance;
  }

  constructor() {
    this.http = new HttpClient({ baseUrl: import.meta.env.VITE_API_URL ?? "" });
  }

  // โครง backend: GET /api/myshop/me
  async me() {
    const result = await this.http.get("/api/myshop/me");
    return { shop: result?.shop ? ShopProfile.fromJSON(result.shop) : null };
  }

  // โครง backend: PUT /api/myshop/me (upsert ลง database)
  async upsert(payload) {
    const result = await this.http.request("/api/myshop/me", {
      method: "PUT",
      body: payload,
    });
    return { shop: result?.shop ? ShopProfile.fromJSON(result.shop) : null };
  }

  // โครง backend: GET /api/myshop/products (ดึงสินค้าที่ผู้ใช้ลงขายจาก database)
  async listProducts() {
    const result = await this.http.get("/api/myshop/products");
    const products = Array.isArray(result?.products)
      ? result.products.map((item) => ShopProduct.fromJSON(item))
      : [];
    return { products };
  }

  // โครง backend: GET /api/products (ดึงสินค้าที่ลงขายทั้งหมดจากผู้ใช้ทุกคน)
  async listMarketplaceProducts() {
    const result = await this.http.get("/api/products");
    const products = Array.isArray(result?.products)
      ? result.products.map((item) => ShopProduct.fromJSON(item))
      : [];
    return { products };
  }

  // โครง backend: GET /api/products/:id (ดึงข้อมูลสินค้าเดี่ยวจาก database)
  async getMarketplaceProductById(productId) {
    const normalizedId = `${productId ?? ""}`.trim();
    if (!normalizedId) return { product: null };

    const result = await this.http.get(`/api/products/${encodeURIComponent(normalizedId)}`);
    return {
      product: result?.product ? ShopProduct.fromJSON(result.product) : null,
    };
  }

  // โครง backend: GET /api/products/search?keyword=... (ค้นหาสินค้าจาก database ด้วยความเหมือนชื่อสินค้า)
  async searchMarketplaceProducts(keyword) {
    const normalizedKeyword = (keyword ?? "").trim();
    const encodedKeyword = encodeURIComponent(normalizedKeyword);
    const searchPath = normalizedKeyword
      ? `/api/products/search?keyword=${encodedKeyword}`
      : "/api/products/search";

    try {
      const result = await this.http.get(searchPath);
      const products = Array.isArray(result?.products)
        ? result.products.map((item) => ShopProduct.fromJSON(item))
        : [];
      return { products };
    } catch (primaryError) {
      // fallback เผื่อ backend ใช้ query เดิม /api/products?keyword=...
      if (!normalizedKeyword) throw primaryError;

      const fallback = await this.http.get(`/api/products?keyword=${encodedKeyword}`);
      const products = Array.isArray(fallback?.products)
        ? fallback.products.map((item) => ShopProduct.fromJSON(item))
        : [];
      return { products };
    }
  }

  // โครง backend: POST /api/myshop/products (สร้างสินค้าใหม่และเก็บลง database)
  async createProduct(payload, imageFiles) {
    const formData = new FormData();

    // payload (รวม category) จะถูกส่งให้ backend เพื่อ persist ลง database
    Object.entries(payload ?? {}).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const files = Array.isArray(imageFiles)
      ? imageFiles.filter(Boolean)
      : imageFiles
        ? [imageFiles]
        : [];

    files.forEach((file) => {
      formData.append("images", file);
    });
    if (files.length === 1) {
      // เผื่อ backend เดิมที่รองรับ field ชื่อ image แบบไฟล์เดียว
      formData.append("image", files[0]);
    }

    const result = await this.http.request("/api/myshop/products", {
      method: "POST",
      body: formData,
    });

    return {
      product: result?.product ? ShopProduct.fromJSON(result.product) : null,
    };
  }

  // โครง backend: PATCH /api/myshop/products/:productId (แก้ไขสินค้าเดิม)
  async updateProduct(productId, payload, imageFiles) {
    const normalizedId = `${productId ?? ""}`.trim();
    if (!normalizedId) throw new Error("ไม่พบรหัสสินค้าที่ต้องการแก้ไข");

    const formData = new FormData();
    Object.entries(payload ?? {}).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const files = Array.isArray(imageFiles)
      ? imageFiles.filter(Boolean)
      : imageFiles
        ? [imageFiles]
        : [];

    files.forEach((file) => {
      formData.append("images", file);
    });
    if (files.length === 1) {
      formData.append("image", files[0]);
    }

    const endpoint = `/api/myshop/products/${encodeURIComponent(normalizedId)}`;

    try {
      const result = await this.http.request(endpoint, {
        method: "PATCH",
        body: formData,
      });

      return {
        product: result?.product ? ShopProduct.fromJSON(result.product) : null,
      };
    } catch {
      const fallback = await this.http.request(endpoint, {
        method: "PUT",
        body: formData,
      });

      return {
        product: fallback?.product ? ShopProduct.fromJSON(fallback.product) : null,
      };
    }
  }

  // โครง backend: DELETE /api/myshop/products/:productId (ลบสินค้า)
  async deleteProduct(productId) {
    const normalizedId = `${productId ?? ""}`.trim();
    if (!normalizedId) throw new Error("ไม่พบรหัสสินค้าที่ต้องการลบ");

    await this.http.request(`/api/myshop/products/${encodeURIComponent(normalizedId)}`, {
      method: "DELETE",
    });
    return true;
  }

  // โครง backend: POST /api/chats (สร้างห้องแชทกับร้านค้าและเก็บลง database)
  async startProductChat({ productId, ownerId, message } = {}) {
    const result = await this.http.post("/api/chats", {
      productId,
      ownerId,
      message: (message ?? "").trim(),
    });

    return {
      chatId: result?.chatId ?? result?.chat?.id ?? "",
      chat: result?.chat ?? null,
      message: result?.message ?? "สร้างห้องแชทแล้ว",
    };
  }
}
