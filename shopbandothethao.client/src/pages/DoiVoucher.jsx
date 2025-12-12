import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import voucherDoiDiemService from '../services/voucherDoiDiemService';
import diemService from '../services/diemService';
import { HiOutlineGift, HiOutlineStar, HiOutlineCheckCircle } from 'react-icons/hi';
import ImageWithFallback from '../components/ImageWithFallback';
import { getImageUrl } from '../utils/imageUtils';

function DoiVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diemKhaDung, setDiemKhaDung] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vouchersData, thongTinDiem] = await Promise.all([
        voucherDoiDiemService.getVouchers(),
        diemService.getThongTinDiem()
      ]);
      setVouchers(vouchersData);
      setDiemKhaDung(thongTinDiem.diemKhaDung || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleDoiVoucher = async (voucherId) => {
    if (!window.confirm('Bạn có chắc chắn muốn đổi voucher này?')) {
      return;
    }

    try {
      const result = await diemService.doiVoucher(voucherId);
      toast.success(result.message || 'Đổi voucher thành công!');
      if (result.maGiamGia) {
        toast.info(`Mã giảm giá của bạn: ${result.maGiamGia}`);
      }
      setDiemKhaDung(result.diemKhaDung || diemKhaDung);
      loadData(); // Reload để cập nhật số lượng
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể đổi voucher');
    }
  };

  const formatGiaTri = (loaiGiamGia, giaTri) => {
    if (loaiGiamGia === 'PhanTram') {
      return `${giaTri}%`;
    }
    return `${new Intl.NumberFormat('vi-VN').format(giaTri)}đ`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineGift className="w-10 h-10 text-pink-600" />
            <span>Đổi Voucher</span>
          </h1>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50 px-6 py-3">
            <p className="text-sm text-gray-600">Điểm khả dụng</p>
            <p className="text-2xl font-bold text-pink-600">{diemKhaDung.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {vouchers.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-12 text-center">
            <HiOutlineGift className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Hiện tại không có voucher nào để đổi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className={`bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 overflow-hidden transition-transform hover:scale-105 ${
                  voucher.coTheDoi
                    ? 'border-pink-100/50 hover:border-pink-300/50'
                    : 'border-gray-200/50 opacity-75'
                }`}
              >
                {voucher.hinhAnh && (
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={getImageUrl(voucher.hinhAnh)}
                      alt={voucher.ten}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{voucher.ten}</h3>
                  {voucher.moTa && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{voucher.moTa}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Giá trị:</span>
                      {voucher.giaTriGiamGia && (
                        <span className="font-bold text-pink-600">
                          {formatGiaTri(voucher.loaiGiamGia, voucher.giaTriGiamGia)}
                        </span>
                      )}
                    </div>
                    {voucher.giaTriDonHangToiThieu && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Áp dụng cho đơn từ:</span>
                        <span className="text-gray-700">
                          {new Intl.NumberFormat('vi-VN').format(voucher.giaTriDonHangToiThieu)}đ
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Điểm cần:</span>
                      <span className="font-bold text-purple-600">
                        {voucher.soDiemCanDoi.toLocaleString('vi-VN')} điểm
                      </span>
                    </div>
                    {voucher.soLuong > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Còn lại:</span>
                        <span className="text-gray-700">
                          {voucher.soLuong - voucher.soLuongDaDoi} / {voucher.soLuong}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDoiVoucher(voucher.id)}
                    disabled={!voucher.coTheDoi}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      voucher.coTheDoi
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {voucher.coTheDoi ? (
                      <span className="flex items-center justify-center gap-2">
                        <HiOutlineCheckCircle className="w-5 h-5" />
                        Đổi ngay
                      </span>
                    ) : (
                      'Không đủ điểm'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoiVoucher;








