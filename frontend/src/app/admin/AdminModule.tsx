import { AuthProvider } from './contexts/AuthContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { AppLayout } from './components/AppLayout';
import { Toaster } from '../components/ui/sonner';

// Đổi tên component thành AdminModule để tránh trùng tên với App tổng
export default function AdminModule() {
  return (
    <AuthProvider>
      <CategoriesProvider>
        {/* Render thẳng giao diện Layout (có Sidebar/Header) của Admin ra đây */}
        <AppLayout />
        <Toaster />
      </CategoriesProvider>
    </AuthProvider>
  );
}