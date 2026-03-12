import { HttpClient } from "./HttpClient";
import { User } from "../models/User"; // ✅ src/models/User.jsx

export class UserService {
  static #instance = null;

  static instance() {
    if (!UserService.#instance) UserService.#instance = new UserService();
    return UserService.#instance;
  }

  constructor() {
    this.http = new HttpClient({ baseUrl: import.meta.env.VITE_API_URL ?? "" });
  }

  // (โครง) ดึงข้อมูล user ปัจจุบัน
  async me() {
    const result = await this.http.get("/api/users/me");
    return { user: result?.user ? User.fromJSON(result.user) : null };
    // ถ้า backend คืนเป็น {data: {...}} ให้ปรับตามจริง
  }

  // (โครง) อัปเดตเฉพาะฟิลด์ที่แก้ได้
  async updateMe(editablePayload) {
    const result = await this.http.patch("/api/users/me", editablePayload);
    return { user: result?.user ? User.fromJSON(result.user) : null };
  }

  // (โครง) อัปเดตโปรไฟล์พร้อมไฟล์รูปลง database
  async updateMeFormData(editablePayload, avatarFile) {
    const formData = new FormData();

    Object.entries(editablePayload ?? {}).forEach(([k, v]) => {
      formData.append(k, v ?? "");
    });
    if (avatarFile) formData.append("avatar", avatarFile);

    const result = await this.http.request("/api/users/me", {
      method: "PATCH",
      body: formData,
    });

    return { user: result?.user ? User.fromJSON(result.user) : null };
  }
}
