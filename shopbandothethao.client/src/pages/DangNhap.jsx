import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi';

function DangNhap() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailHoacSoDienThoai: '',
    matKhau: '',
  });
  const [loading, setLoading] = useState(false);

  // Lấy URL cần redirect sau khi đăng nhập
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.dangNhap(formData);
      toast.success('Đăng nhập thành công!');
      
      // Redirect về trang admin nếu đăng nhập từ admin route
      if (from.startsWith('/admin')) {
        navigate(from);
      } else {
        navigate('/');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const isAdminLogin = from.startsWith('/admin');

  return (
    <div className={`min-h-screen flex items-center justify-center ${isAdminLogin ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
      {/* Animated background blobs for admin login */}
      {isAdminLogin && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </>
      )}
      
      {/* Animated background blobs for regular login */}
      {!isAdminLogin && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </>
      )}
      
      <div className={`relative z-10 w-full max-w-md px-4 ${isAdminLogin ? '' : 'container mx-auto py-12'}`}>
        <div className={`${isAdminLogin 
          ? 'backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl border border-white/30 p-8' 
          : 'backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8'}`}>
          <h2 className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2 ${isAdminLogin 
            ? 'bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'}`}>
            {isAdminLogin ? (
              <>
                <span>🔐</span>
                <span>Đăng nhập Quản trị</span>
              </>
            ) : (
              <>
                <HiOutlineSparkles className="w-8 h-8 text-pink-600" />
                <span>Đăng nhập</span>
              </>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${isAdminLogin ? 'text-white' : 'text-gray-700'}`}>
                {!isAdminLogin && <HiOutlineMail className="w-5 h-5 text-pink-600" />}
                <span>Email hoặc số điện thoại</span>
              </label>
              <input
                type="text"
                required
                value={formData.emailHoacSoDienThoai}
                onChange={(e) =>
                  setFormData({ ...formData, emailHoacSoDienThoai: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isAdminLogin 
                    ? 'backdrop-blur-md bg-white/30 border border-white/40 text-white placeholder-white/70 focus:ring-purple-400 focus:border-purple-400' 
                    : 'border-2 border-pink-100 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md hover:border-pink-200'
                }`}
                placeholder="Nhập email hoặc số điện thoại"
              />
            </div>
            <div>
              <label className={`flex items-center gap-2 text-sm font-bold mb-2 ${isAdminLogin ? 'text-white' : 'text-gray-700'}`}>
                {!isAdminLogin && <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />}
                <span>Mật khẩu</span>
              </label>
              <input
                type="password"
                required
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isAdminLogin 
                    ? 'backdrop-blur-md bg-white/30 border border-white/40 text-white placeholder-white/70 focus:ring-purple-400 focus:border-purple-400' 
                    : 'border-2 border-pink-100 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md hover:border-pink-200'
                }`}
                placeholder="Nhập mật khẩu"
              />
            </div>
            {!isAdminLogin && (
              <div className="text-right">
                <Link
                  to="/quen-mat-khau"
                  className="text-sm text-pink-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isAdminLogin
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-xl border border-white/30 hover:scale-105'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-xl hover:shadow-2xl hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  {!isAdminLogin && <HiOutlineUser className="w-5 h-5" />}
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>
          {!isAdminLogin && (
            <p className="mt-6 text-center text-sm font-medium">
              Chưa có tài khoản?{' '}
              <Link to="/dang-ky" className="text-pink-600 hover:text-purple-600 font-bold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default DangNhap;

