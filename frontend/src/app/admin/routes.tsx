import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PromptsPage } from './pages/PromptsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CareersPage } from './pages/CareersPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { MarketDataPage } from './pages/MarketDataPage';
import { AccountsPage } from './pages/AccountsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Export dạng mảng Object để file tổng bên ngoài có thể import và gộp dễ dàng
export const adminRoutes = [
  {
    path: 'admin/login', // Sẽ chạy đường dẫn: /admin/login
    Component: LoginPage,
  },
  {
    path: 'admin', // Thư mục cha của phần admin quản trị
    Component: AppLayout, // Layout chứa Sidebar và Header riêng của admin
    children: [
      {
        index: true, // Đường dẫn mặc định: /admin
        Component: DashboardPage,
      },
      {
        path: 'prompts', // Đường dẫn: /admin/prompts
        Component: PromptsPage,
      },
      {
        path: 'categories', // Đường dẫn: /admin/categories
        Component: CategoriesPage,
      },
      {
        path: 'careers', // Đường dẫn: /admin/careers
        Component: CareersPage,
      },
      {
        path: 'questions', // Đường dẫn: /admin/questions
        Component: QuestionsPage,
      },
      {
        path: 'market-data', // Đường dẫn: /admin/market-data
        Component: MarketDataPage,
      },
      {
        path: 'accounts', // Đường dẫn: /admin/accounts
        Component: AccountsPage,
      },
      {
        path: 'analytics', // Đường dẫn: /admin/analytics
        Component: AnalyticsPage,
      },
      {
        path: 'settings', // Đường dẫn: /admin/settings
        Component: SettingsPage,
      },
    ],
  },
];