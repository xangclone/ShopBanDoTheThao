import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineSparkles, HiOutlinePhone, HiOutlineX } from 'react-icons/hi';

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    emailHoacSoDienThoai: '',
    matKhau: '',
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
    soDienThoai: '',
    ho: '',
    ten: '',
  });

  if (!isOpen) return null;

  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.dangNhap(loginData);
      toast.success('Đăng nhập thành công!');
      onClose();
      
      // Redirect về trang admin nếu đăng nhập từ admin route
      if (from.startsWith('/admin')) {
        navigate(from);
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.matKhau !== registerData.xacNhanMatKhau) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.dangKy(registerData);
      toast.success('Đăng ký thành công!');
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-pink-100/50 px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineSparkles className="w-6 h-6 text-pink-600" />
            <span>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 hover:bg-pink-50 rounded-full p-2"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 border-b-2 border-pink-100/50">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-bold transition-all duration-300 ${
                isLogin
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-gradient-to-b from-pink-50/50 to-transparent'
                  : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-bold transition-all duration-300 ${
                !isLogin
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-gradient-to-b from-pink-50/50 to-transparent'
                  : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlineMail className="w-5 h-5 text-pink-600" />
                  <span>Email hoặc số điện thoại</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginData.emailHoacSoDienThoai}
                  onChange={(e) =>
                    setLoginData({ ...loginData, emailHoacSoDienThoai: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập email hoặc số điện thoại"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />
                  <span>Mật khẩu</span>
                </label>
                <input
                  type="password"
                  required
                  value={loginData.matKhau}
                  onChange={(e) => setLoginData({ ...loginData, matKhau: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập mật khẩu"
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
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineUser className="w-5 h-5" />
                    <span>Đăng nhập</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlineMail className="w-5 h-5 text-pink-600" />
                  <span>Email <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlinePhone className="w-5 h-5 text-pink-600" />
                  <span>Số điện thoại</span>
                </label>
                <input
                  type="tel"
                  value={registerData.soDienThoai}
                  onChange={(e) => setRegisterData({ ...registerData, soDienThoai: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlineUser className="w-5 h-5 text-pink-600" />
                    <span>Họ</span>
                  </label>
                  <input
                    type="text"
                    value={registerData.ho}
                    onChange={(e) => setRegisterData({ ...registerData, ho: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                    placeholder="Nhập họ"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlineUser className="w-5 h-5 text-pink-600" />
                    <span>Tên</span>
                  </label>
                  <input
                    type="text"
                    value={registerData.ten}
                    onChange={(e) => setRegisterData({ ...registerData, ten: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                    placeholder="Nhập tên"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />
                  <span>Mật khẩu <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerData.matKhau}
                  onChange={(e) => setRegisterData({ ...registerData, matKhau: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                  <HiOutlineLockClosed className="w-5 h-5 text-pink-600" />
                  <span>Xác nhận mật khẩu <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="password"
                  required
                  value={registerData.xacNhanMatKhau}
                  onChange={(e) => setRegisterData({ ...registerData, xacNhanMatKhau: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                  placeholder="Nhập lại mật khẩu"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;



