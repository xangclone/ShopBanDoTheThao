import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowLeft } from 'react-icons/hi';

function ResetMatKhau() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    matKhau: '',
    xacNhanMatKhau: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [tokenId, setTokenId] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const idParam = searchParams.get('id');
    
    if (!tokenParam || !idParam) {
      toast.error('Link không hợp lệ');
      navigate('/quen-mat-khau');
      return;
    }

    setToken(tokenParam);
    setTokenId(idParam);
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.matKhau.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await authService.resetMatKhau(token, parseInt(tokenId), formData.matKhau);
      setSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
      
      // Set flag để mở popup đăng nhập
      localStorage.setItem('openLoginModal', 'true');
      
      // Redirect về trang chủ sau 2 giây và reload để Header check flag
      setTimeout(() => {
        navigate('/');
        // Reload để Header useEffect chạy lại và mở popup
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể đặt lại mật khẩu. Link có thể đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-green-100/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đặt lại mật khẩu thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Mật khẩu của bạn đã được đặt lại thành công.
              <br />
              Bạn có thể đăng nhập với mật khẩu mới.
            </p>
            <Link
              to="/dang-nhap"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !tokenId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
              <HiOutlineLockClosed className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.matKhau}
                  onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.xacNhanMatKhau}
                  onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/dang-nhap"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetMatKhau;

