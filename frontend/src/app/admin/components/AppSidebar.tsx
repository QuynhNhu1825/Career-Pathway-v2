import {
  Dashboard as DashboardIcon,
  Description,
  Work,
  Folder,
  HelpOutline,
  TrendingUp,
  People,
  BarChart,
  Settings,
  Logout,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

// 1. Định nghĩa mảng menu với `tab` tương ứng thay vì dùng `path` của router
const menuItems = [
  { title: "Dashboard", icon: DashboardIcon, tab: "dashboard" },
  { title: "Quản lý Prompt", icon: Description, tab: "prompts" },
  { title: "Danh mục ngành", icon: Folder, tab: "categories" },
  { title: "Nghề nghiệp", icon: Work, tab: "careers" },
  { title: "Ngân hàng câu hỏi", icon: HelpOutline, tab: "questions" },
  { title: "Dữ liệu thị trường", icon: TrendingUp, tab: "market-data" },
  { title: "Quản lý tài khoản", icon: People, tab: "accounts" },
  { title: "Thống kê & Phân tích", icon: BarChart, tab: "analytics" },
  { title: "Cấu hình & Bảo trì", icon: Settings, tab: "settings" },
];

// 2. Định nghĩa Interface Props để TypeScript hết báo lỗi đỏ ở file AppLayout
interface AppSidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export function AppSidebar({ currentTab, onChangeTab }: AppSidebarProps) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    // Do chạy bằng state tổng của User, khi logout bạn có thể để hệ thống tự reload 
    // hoặc xử lý chuyển view login tùy cấu hình của AuthProvider bên bạn.
    window.location.reload(); 
  };

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#f59e0b",
              borderRadius: "10px",
            }}
          >
            <DashboardIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Avatar>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
              Admin Dashboard
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
              Hệ thống quản lý
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#9ca3af",
            textTransform: "uppercase",
            mb: 1,
            px: 1,
          }}
        >
          Menu chính
        </Typography>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            // 3. Kiểm tra active dựa theo State tab hiện tại
            const active = currentTab === item.tab;
            const Icon = item.icon;

            return (
              <ListItemButton
                key={item.tab}
                // 4. Kích hoạt chuyển trang bằng cách gọi hàm đổi State tab
                onClick={() => onChangeTab(item.tab)}
                sx={{
                  mb: 0.5,
                  borderRadius: "10px",
                  px: 1.5,
                  py: 1,
                  color: active ? "#92400e" : "#4b5563",
                  bgcolor: active ? "#fef3c7" : "transparent",
                  border: active ? "1px solid #fbbf24" : "1px solid transparent",
                  "&:hover": {
                    bgcolor: active ? "#fde68a" : "#f9fafb",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>

                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            {user?.name || "Admin"}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "#6b7280",
              maxWidth: 190,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.email || "admin@example.com"}
          </Typography>
        </Box>

        <IconButton
          onClick={handleLogout}
          sx={{
            width: 36,
            height: 36,
            color: "#6b7280",
            "&:hover": {
              color: "#dc2626",
              bgcolor: "#fee2e2",
            },
          }}
        >
          <Logout sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}