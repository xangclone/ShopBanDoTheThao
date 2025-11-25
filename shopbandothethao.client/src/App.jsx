import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import DiscountPopup from './components/DiscountPopup';
import ChatBot from './components/ChatBot';
import TrangChu from './pages/TrangChu';
import DanhSachSanPham from './pages/DanhSachSanPham';
import SanPhamKhuyenMai from './pages/SanPhamKhuyenMai';
import ChiTietSanPham from './pages/ChiTietSanPham';
import GioHang from './pages/GioHang';
import DangNhap from './pages/DangNhap';
import DangKy from './pages/DangKy';
import DonHang from './pages/DonHang';
import ChiTietDonHang from './pages/ChiTietDonHang';
import ThanhToan from './pages/ThanhToan';
import TaiKhoan from './pages/TaiKhoan';
import YeuThich from './pages/YeuThich';
import ThemDiaChi from './pages/ThemDiaChi';
import TinTuc from './pages/TinTuc';
import ChiTietTinTuc from './pages/ChiTietTinTuc';
import VeChungToi from './pages/VeChungToi';
import Dashboard from './pages/admin/Dashboard';
import QuanLyDonHang from './pages/admin/QuanLyDonHang';
import QuanLySanPham from './pages/admin/QuanLySanPham';
import QuanLyKho from './pages/admin/QuanLyKho';
import QuanLyNguoiDung from './pages/admin/QuanLyNguoiDung';
import QuanLyDanhMuc from './pages/admin/QuanLyDanhMuc';
import QuanLyThuongHieu from './pages/admin/QuanLyThuongHieu';
import QuanLyMaGiamGia from './pages/admin/QuanLyMaGiamGia';
import QuanLyBanner from './pages/admin/QuanLyBanner';
import QuanLyTinTuc from './pages/admin/QuanLyTinTuc';
import QuanLyDanhGia from './pages/admin/QuanLyDanhGia';
import QuanLyChat from './pages/admin/QuanLyChat';
import QuanLyThongBao from './pages/admin/QuanLyThongBao';
import ChiTietDoanhThu from './pages/admin/ChiTietDoanhThu';
import ChiTietDonHangAdmin from './pages/admin/ChiTietDonHang';
import AdminLayout from './components/Layout/AdminLayout';
import AdminRoute from './components/AdminRoute';
import { authService } from './services/authService';

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/dang-nhap" />;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/dang-nhap';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && !isAdminPage && <Header />}
      {!isLoginPage && !isAdminPage && <DiscountPopup />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/san-pham" element={<DanhSachSanPham />} />
          <Route path="/san-pham/khuyen-mai" element={<SanPhamKhuyenMai />} />
          <Route path="/san-pham/:id" element={<ChiTietSanPham />} />
          <Route path="/dang-nhap" element={<DangNhap />} />
            <Route path="/dang-ky" element={<DangKy />} />
            <Route
              path="/gio-hang"
              element={
                <ProtectedRoute>
                  <GioHang />
                </ProtectedRoute>
              }
            />
            <Route
              path="/don-hang"
              element={
                <ProtectedRoute>
                  <DonHang />
                </ProtectedRoute>
              }
            />
            <Route
              path="/don-hang/:id"
              element={
                <ProtectedRoute>
                  <ChiTietDonHang />
                </ProtectedRoute>
              }
            />
            <Route
              path="/thanh-toan"
              element={
                <ProtectedRoute>
                  <ThanhToan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tai-khoan"
              element={
                <ProtectedRoute>
                  <TaiKhoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yeu-thich"
              element={
                <ProtectedRoute>
                  <YeuThich />
                </ProtectedRoute>
              }
            />
            <Route
              path="/them-dia-chi"
              element={
                <ProtectedRoute>
                  <ThemDiaChi />
                </ProtectedRoute>
              }
            />
            <Route path="/tin-tuc" element={<TinTuc />} />
            <Route path="/tin-tuc/:id" element={<ChiTietTinTuc />} />
            <Route path="/ve-chung-toi" element={<VeChungToi />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/don-hang"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyDonHang />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/san-pham"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLySanPham />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/kho"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyKho />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/nguoi-dung"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyNguoiDung />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/danh-muc"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyDanhMuc />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/thuong-hieu"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyThuongHieu />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/ma-giam-gia"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyMaGiamGia />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/banner"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyBanner />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tin-tuc"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyTinTuc />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/danh-gia"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyDanhGia />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/chat"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyChat />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/thong-bao"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <QuanLyThongBao />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/chi-tiet-doanh-thu"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ChiTietDoanhThu />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/chi-tiet-don-hang"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ChiTietDonHangAdmin />
                  </AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        {!isLoginPage && !isAdminPage && <Footer />}
        {!isLoginPage && !isAdminPage && <ChatBot />}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
