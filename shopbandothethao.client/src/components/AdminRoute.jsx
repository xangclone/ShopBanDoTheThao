import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useEffect, useState } from 'react';

function AdminRoute({ children }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        // Lấy thông tin user hiện tại từ API để đảm bảo có vai trò mới nhất
        const user = await authService.getCurrentUser();
        const isAdmin = user && user.vaiTro === 'QuanTriVien';
        setIsAuthorized(isAdmin);
      } catch (error) {
        console.error('Lỗi khi kiểm tra quyền:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!authService.isAuthenticated()) {
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    return <Navigate to="/dang-nhap" state={{ from: location.pathname }} replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không có quyền truy cập</h2>
        <p className="text-gray-600 mb-4">Bạn cần quyền quản trị viên để truy cập trang này.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}

export default AdminRoute;

