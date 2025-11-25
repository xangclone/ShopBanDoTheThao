import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { maGiamGiaService } from '../services/maGiamGiaService';

function DiscountPopup() {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem đã đóng popup trong 15 phút chưa
    const closedTime = localStorage.getItem('discountPopupClosed');
    if (closedTime) {
      const timeDiff = Date.now() - parseInt(closedTime);
      const fifteenMinutes = 15 * 60 * 1000; // 15 phút = 900000ms
      
      if (timeDiff < fifteenMinutes) {
        // Chưa đủ 15 phút, không hiển thị
        return;
      } else {
        // Đã quá 15 phút, xóa thông tin cũ
        localStorage.removeItem('discountPopupClosed');
      }
    }

    // Load mã giảm giá từ API
    loadDiscountCode();
  }, []);

  useEffect(() => {
    // Hiển thị popup sau khi có code và sau 2 giây
    if (code) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [code]);

  const loadDiscountCode = async () => {
    try {
      const data = await maGiamGiaService.getDangHoatDong(1);
      if (data && data.length > 0) {
        const maGiamGia = data[0];
        setCode(maGiamGia.ma);
        setDiscountInfo(maGiamGia);
      } else {
        // Fallback nếu không có mã nào
        setCode('WELCOME10');
      }
    } catch (error) {
      console.error('Lỗi khi tải mã giảm giá:', error);
      setCode('WELCOME10'); // Fallback
    }
  };

  const handleClose = () => {
    setShow(false);
    // Lưu thời gian đóng popup
    localStorage.setItem('discountPopupClosed', Date.now().toString());
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Đã sao chép mã giảm giá!', {
        position: 'top-center',
        autoClose: 2000,
      });
    } catch (error) {
      // Fallback cho trình duyệt không hỗ trợ clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Đã sao chép mã giảm giá!', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  const handleGoToCheckout = () => {
    handleClose();
    navigate('/thanh-toan');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Đóng"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Banner Image */}
        <div className="relative h-48 bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <h2 className="text-3xl font-extrabold mb-2 text-center">ƯU ĐÃI ĐẶC BIỆT</h2>
            <p className="text-xl font-semibold text-center">Giảm giá</p>
            <div className="text-5xl font-black mt-2">
              {discountInfo?.loaiGiamGia === 'PhanTram' 
                ? `${discountInfo.giaTriGiamGia}%`
                : `${new Intl.NumberFormat('vi-VN').format(discountInfo?.giaTriGiamGia || 50000)}đ`}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Nhận ngay mã giảm giá!
          </h3>
          <p className="text-center text-gray-600 mb-2">
            {discountInfo?.moTa || 'Sử dụng mã giảm giá bên dưới để nhận ưu đãi đặc biệt cho đơn hàng đầu tiên'}
          </p>
          {discountInfo && (
            <div className="text-center mb-4">
              {discountInfo.loaiGiamGia === 'PhanTram' ? (
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Giảm {discountInfo.giaTriGiamGia}%
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Giảm {new Intl.NumberFormat('vi-VN').format(discountInfo.giaTriGiamGia)}đ
                </span>
              )}
            </div>
          )}

          {/* Discount Code */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border-2 border-dashed border-blue-300">
            <div className="text-center mb-2">
              <span className="text-sm text-gray-600">Mã giảm giá của bạn:</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-500">
                <span className="text-2xl font-bold text-blue-600 tracking-wider">{code}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                title="Sao chép mã"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoToCheckout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Mua ngay với mã giảm giá
            </button>
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Để sau
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-gray-500 mt-4">
            {discountInfo?.giaTriDonHangToiThieu 
              ? `Mã giảm giá áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(discountInfo.giaTriDonHangToiThieu)}đ`
              : 'Mã giảm giá có thể áp dụng cho đơn hàng từ 500.000đ'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DiscountPopup;

