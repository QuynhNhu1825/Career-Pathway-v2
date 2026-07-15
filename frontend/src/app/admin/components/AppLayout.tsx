import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

// Import tất cả các trang con của Admin vào đây
import { DashboardPage } from "../pages/DashboardPage";
import { PromptsPage } from "../pages/PromptsPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { CareersPage } from "../pages/CareersPage";
import { QuestionsPage } from "../pages/QuestionsPage";
import { MarketDataPage } from "../pages/MarketDataPage";
import { AccountsPage } from "../pages/AccountsPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { LoginPage } from "../pages/LoginPage";
import { useAuth } from "../contexts/AuthContext";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  
  // 1. Quản lý tab hiện tại của Admin bằng State thay vì URL Router
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Giả lập logic kiểm tra đăng nhập (Nếu chưa đăng nhập thì ép xem trang Login)
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 2. Hàm lấy tiêu đề hiển thị trên thanh Breadcrumbs dựa theo State tab
  const getPageTitle = (tab: string) => {
    const routes: Record<string, string> = {
      dashboard: "Dashboard",
      prompts: "Quản lý Prompt",
      categories: "Danh mục ngành",
      careers: "Nghề nghiệp",
      questions: "Ngân hàng câu hỏi",
      "market-data": "Dữ liệu thị trường",
      accounts: "Quản lý tài khoản",
      analytics: "Thống kê & Phân tích",
      settings: "Cấu hình & Bảo trì",
    };

    return routes[tab] || "Dashboard";
  };

  // 3. Hàm render nội dung trang tương ứng với State tab (Thay thế cho <Outlet />)
  const renderMainContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardPage />;
      case "prompts":
        return <PromptsPage />;
      case "categories":
        return <CategoriesPage />;
      case "careers":
        return <CareersPage />;
      case "questions":
        return <QuestionsPage />;
      case "market-data":
        return <MarketDataPage />;
      case "accounts":
        return <AccountsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* 4. Truyền State và hàm đổi State xuống Sidebar để khi bấm menu nó đổi được trang */}
      <AppSidebar currentTab={currentTab} onChangeTab={setCurrentTab} />

      <Box
        sx={{
          flex: 1,
          ml: "280px",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <Box
          component="header"
          sx={{
            height: 64,
            px: 3,
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Breadcrumbs sx={{ fontSize: 14 }}>
            <Link
              underline="hover"
              color="#6b7280"
              sx={{ cursor: "pointer", fontSize: 14 }}
            >
              Trang chủ
            </Link>

            <Typography sx={{ color: "#111827", fontSize: 14, fontWeight: 600 }}>
              {getPageTitle(currentTab)}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box
          component="main"
          sx={{
            p: 3,
          }}
        >
          {/* 5. Nội dung trang hiển thị ở đây */}
          {renderMainContent()}
        </Box>
      </Box>
    </Box>
  );
}