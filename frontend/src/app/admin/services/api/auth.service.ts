import { API_BASE } from "./config";

export interface LoginUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginUser | null> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!response.ok) {
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
  }

  const data = await response.json();
  
  // Kiểm tra cấu hình trả về của Backend (Đảm bảo có data.success và data.token)
  if (!data.success || !data.token) {
    return null;
  }

  // 🚀 LƯU JWT TOKEN VÀO LOCALSTORAGE CHO MIDDLEWARE VERIFYADMIN CHECK
  localStorage.setItem("token", data.token);

  // Ép dữ liệu user (Tùy backend trả về dữ liệu user nằm ở data.user hay giải mã từ token)
  const user = data.user || {};
  
  if (user.role !== "admin") {
    localStorage.removeItem("token");
    throw new Error("Tài khoản của bạn không có quyền truy cập trang quản trị!");
  }

  const adminUser: LoginUser = {
    id: (user.id || user.MaTK || "").toString(),
    email: user.email || user.TenDangNhap || "",
    name: data.profile?.fullName || "Admin User",
    role: user.role,
  };

  // Đồng bộ lưu vào key "user" giống như dự án tổng của bạn
  localStorage.setItem("user", JSON.stringify(adminUser));

  return adminUser;
}