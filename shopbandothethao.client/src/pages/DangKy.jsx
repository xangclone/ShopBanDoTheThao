import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineSparkles, HiOutlinePhone } from 'react-icons/hi';

function DangKy() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
    soDienThoai: '',
    ho: '',
    ten: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.dangKy(formData);
      toast.success('Đăng ký thành công!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ✨ Đăng ký
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                <HiOutlineMail className="w-5 h-5 text-pink-600" />
                <span>Email <span className="text-red-500">*</span></span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                <HiOutlinePhone className="w-5 h-5 text-pink-600" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="tel"
                value={formData.soDienThoai}
                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                  <HiOutlineUser className="w-5 h-5 text-pink-600" />
                  <span>Họ</span>
                </label>
                <input
                  type="text"
                  value={formData.ho}
                  onChange={(e) => setFormData({ ...formData, ho: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                  <HiOutlineUser className="w-5 h-5 text-pink-600" />
                  <span>Tên</span>
                </label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />
                <span>Mật khẩu <span className="text-red-500">*</span></span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
                <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />
                <span>Xác nhận mật khẩu <span className="text-red-500">*</span></span>
              </label>
              <input
                type="password"
                required
                value={formData.xacNhanMatKhau}
                onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="w-5 h-5" />
                  <span>Đăng ký</span>
                </>
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm font-medium">
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" className="text-pink-600 hover:text-purple-600 font-bold transition-colors">
              Đăng nhập
            </Link>
          </p>
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

export default DangKy;



