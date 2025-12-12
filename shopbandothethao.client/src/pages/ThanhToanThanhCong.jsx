import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi';

function ThanhToanThanhCong() {
  const [searchParams] = useSearchParams();
  const [maDonHang, setMaDonHang] = useState('');
  const [tongTien, setTongTien] = useState('');

  useEffect(() => {
    // Lấy thông tin từ URL params
    const maDon = searchParams.get('maDonHang');
    const tien = searchParams.get('tongTien');
    
    if (maDon) setMaDonHang(maDon);
    if (tien) setTongTien(tien);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-green-100/50 p-8 sm:p-12">
          {/* Animated Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-200 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full animate-pulse"></div>
              </div>
              <HiOutlineCheckCircle className="relative w-32 h-32 text-green-500 animate-scale-in" />
            </div>
          </div>

          {/* Success Title */}
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Thanh toán thành công!
          </h1>

          {/* Success Message */}
          <p className="text-lg text-gray-700 mb-6">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
          </p>

          {/* Order Information */}
          {maDonHang && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HiOutlineDocumentText className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-gray-600">Mã đơn hàng</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{maDonHang}</p>
              {tongTien && (
                <p className="text-lg text-gray-600 mt-2">
                  Tổng tiền: <span className="font-bold text-green-700">{new Intl.NumberFormat('vi-VN').format(parseInt(tongTien))}đ</span>
                </p>
              )}
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-800">
              📧 Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.
              <br />
              Bạn có thể theo dõi đơn hàng trong mục <Link to="/don-hang" className="font-semibold underline hover:text-blue-600">Đơn hàng của tôi</Link>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/don-hang"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              Xem đơn hàng
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200 transform hover:scale-105 w-full sm:w-auto"
            >
              <HiOutlineHome className="w-5 h-5" />
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ThanhToanThanhCong;













