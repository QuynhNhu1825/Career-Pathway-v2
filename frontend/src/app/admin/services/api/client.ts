import { API_BASE } from "./config";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // 🚀 LẤY JWT TOKEN ĐÃ ĐƯỢC LƯU KHI LOGIN
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 🚀 ĐÍNH KÈM TOKEN THEO CHUẨN BEARER CHO MIDDLEWARE VERIFYADMIN KIỂM TRA
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    let errJson;
    try {
      errJson = JSON.parse(errText);
    } catch (e) {}
    
    // Nếu dính lỗi 401 hoặc token hết hạn, có thể logout tự động tại đây
    if (response.status === 401) {
      console.error("Yêu cầu xác thực Admin thất bại hoặc token hết hạn.");
    }
    
    throw new Error(errJson?.message || errText || "API Error");
  }

  return response.json();
}