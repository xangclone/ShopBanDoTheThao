import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';

function QuenMatKhau() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await authService.quenMatKhau(email);
      setEmailSent(true);
      toast.success('Đã gửi email đặt lại mật khẩu!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
                  <HiOutlineMail className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Quên mật khẩu?
                </h1>
                <p className="text-gray-600">
                  Nhập email của bạn để nhận link đặt lại mật khẩu
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
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
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <HiOutlineCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Đã gửi email!
                </h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>.
                  <br />
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                </p>
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Lưu ý:</strong> Nếu không thấy email, vui lòng kiểm tra thư mục Spam.
                  </p>
                </div>
                <Link
                  to="/dang-nhap"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuenMatKhau;





