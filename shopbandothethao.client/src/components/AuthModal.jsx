import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineSparkles, HiOutlinePhone, HiOutlineX, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
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

  // Google Client ID - Cần thay bằng Client ID thực tế từ Google Cloud Console
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

  useEffect(() => {
    if (isOpen && window.google) {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
    }

    // Initialize Facebook SDK
    if (isOpen && window.FB) {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    }
  }, [isOpen]);

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

  const handleGoogleCallback = async (response) => {
    try {
      setLoading(true);
      
      // Decode JWT token để lấy thông tin user
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleData = {
        idToken: response.credential,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      const result = await authService.googleLogin(googleData);
      toast.success('Đăng nhập Google thành công!');
      onClose();
      
      if (from.startsWith('/admin')) {
        navigate(from);
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error('Google Sign-In chưa được tải. Vui lòng thử lại sau.');
      return;
    }
    
    // Sử dụng Google One Tap hoặc popup
    try {
      window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (tokenResponse) => {
          try {
            setLoading(true);
            
            // Lấy thông tin user từ Google API
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });
            const userInfo = await userInfoResponse.json();
            
            const googleData = {
              idToken: tokenResponse.access_token,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
            };

            const result = await authService.googleLogin(googleData);
            toast.success('Đăng nhập Google thành công!');
            onClose();
            
            if (from.startsWith('/admin')) {
              navigate(from);
            } else {
              window.location.reload();
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập Google thất bại');
          } finally {
            setLoading(false);
          }
        },
      }).requestAccessToken();
    } catch (error) {
      toast.error('Lỗi khi khởi tạo Google Sign-In');
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error('Facebook SDK chưa được tải. Vui lòng thử lại sau.');
      return;
    }

    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          setLoading(true);
          
          // Lấy thông tin user từ Facebook Graph API
          window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userInfo) => {
            try {
              const facebookData = {
                accessToken: response.authResponse.accessToken,
                userId: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture?.data?.url,
              };

              const result = await authService.facebookLogin(facebookData);
              toast.success('Đăng nhập Facebook thành công!');
              onClose();
              
              if (from.startsWith('/admin')) {
                navigate(from);
              } else {
                window.location.reload();
              }
            } catch (error) {
              toast.error(error.response?.data?.message || 'Đăng nhập Facebook thất bại');
            } finally {
              setLoading(false);
            }
          });
        } catch (error) {
          toast.error('Lỗi khi đăng nhập Facebook');
          setLoading(false);
        }
      } else {
        toast.error('Đăng nhập Facebook bị hủy');
      }
    }, { scope: 'email,public_profile' });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ');
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await authService.quenMatKhau(forgotPasswordEmail);
      setEmailSent(true);
      toast.success('Đã gửi email đặt lại mật khẩu!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Nếu đang hiển thị quên mật khẩu
  if (showForgotPassword) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-md">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-pink-100/50 px-6 py-4 flex justify-between items-center rounded-t-3xl">
            <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <HiOutlineMail className="w-6 h-6 text-pink-600" />
              <span>Quên mật khẩu</span>
            </h2>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setEmailSent(false);
                setForgotPasswordEmail('');
              }}
              className="text-gray-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 hover:bg-pink-50 rounded-full p-2"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {!emailSent ? (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  Nhập email của bạn để nhận link đặt lại mật khẩu
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                      <HiOutlineMail className="w-5 h-5 text-pink-600" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-pink-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineMail className="w-5 h-5" />
                        <span>Gửi link đặt lại mật khẩu</span>
                      </>
                    )}
                  </button>
                </form>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Quay lại đăng nhập
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Đã gửi email!
                </h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{forgotPasswordEmail}</strong>.
                  <br />
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                </p>
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Lưu ý:</strong> Nếu không thấy email, vui lòng kiểm tra thư mục Spam.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setEmailSent(false);
                    setForgotPasswordEmail('');
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-pink-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
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

              {/* OAuth Buttons */}
              <div className="mt-6">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-pink-200"></div>
                  <span className="px-4 text-sm text-gray-500 bg-white/70">Hoặc</span>
                  <div className="flex-grow border-t border-pink-200"></div>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaGoogle className="w-5 h-5 text-red-500" />
                    <span>Đăng nhập với Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl hover:bg-[#166FE5] font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFacebook className="w-5 h-5" />
                    <span>Đăng nhập với Facebook</span>
                  </button>
                </div>
              </div>
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

              {/* OAuth Buttons */}
              <div className="mt-6">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-pink-200"></div>
                  <span className="px-4 text-sm text-gray-500 bg-white/70">Hoặc</span>
                  <div className="flex-grow border-t border-pink-200"></div>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaGoogle className="w-5 h-5 text-red-500" />
                    <span>Đăng ký với Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl hover:bg-[#166FE5] font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaFacebook className="w-5 h-5" />
                    <span>Đăng ký với Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;



