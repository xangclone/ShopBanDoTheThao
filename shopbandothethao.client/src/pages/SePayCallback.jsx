import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sePayService } from '../services/sePayService';
import { toast } from 'react-toastify';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

function SePayCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const donHangId = searchParams.get('donHangId');

  useEffect(() => {
    if (donHangId) {
      checkPaymentStatus();
    } else {
      setStatus('failed');
    }
  }, [donHangId]);

  const checkPaymentStatus = async () => {
    try {
      const result = await sePayService.checkPaymentStatus(parseInt(donHangId));
      
      if (result && result.success && result.status === 'success') {
        setStatus('success');
        toast.success('Thanh toán thành công!');
        setTimeout(() => {
          navigate(`/don-hang/${donHangId}`);
        }, 2000);
      } else {
        setStatus('failed');
        toast.error('Thanh toán chưa hoàn tất hoặc thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
      setStatus('failed');
      toast.error('Không thể kiểm tra trạng thái thanh toán');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8 md:p-12 max-w-md w-full text-center">
        {status === 'checking' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-6"></div>
            <HiOutlineClock className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đang kiểm tra thanh toán...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineCheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">Đơn hàng của bạn đã được xác nhận</p>
            <p className="text-sm text-gray-500">Đang chuyển đến trang đơn hàng...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineXCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-6">Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
            <button
              onClick={() => navigate(donHangId ? `/don-hang/${donHangId}` : '/')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
            >
              Quay lại
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SePayCallback;

