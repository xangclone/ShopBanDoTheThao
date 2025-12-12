import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import diemService from '../services/diemService';
import { 
  HiOutlineStar, 
  HiOutlineGift, 
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
  HiOutlineInformationCircle
} from 'react-icons/hi';

function TichDiem() {
  const [thongTin, setThongTin] = useState(null);
  const [lichSu, setLichSu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [thongTinData, lichSuData] = await Promise.all([
        diemService.getThongTinDiem(),
        diemService.getLichSuDiem(page, 20)
      ]);
      setThongTin(thongTinData);
      setLichSu(lichSuData.data || []);
      setTotalPages(lichSuData.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải thông tin điểm');
    } finally {
      setLoading(false);
    }
  };

  const getLoaiIcon = (loai) => {
    switch (loai) {
      case 'TichDiem':
        return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'DoiVoucher':
        return <HiOutlineGift className="w-5 h-5 text-purple-500" />;
      case 'Minigame':
        return <HiOutlineStar className="w-5 h-5 text-yellow-500" />;
      case 'Thuong':
        return <HiOutlineStar className="w-5 h-5 text-pink-500" />;
      default:
        return <HiOutlineClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineStar className="w-10 h-10 text-pink-600" />
            <span>Tích điểm & Hạng VIP</span>
          </h1>
          <Link
            to="/ho-tro/chinh-sach-tich-diem"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <HiOutlineInformationCircle className="w-5 h-5" />
            <span>Xem chính sách tích điểm</span>
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Thông tin điểm và hạng VIP */}
        {thongTin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card điểm */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Điểm của bạn
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Điểm tích lũy</p>
                  <p className="text-4xl font-bold text-pink-600">
                    {thongTin.diemTichLuy.toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Điểm khả dụng</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {thongTin.diemKhaDung.toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Card hạng VIP */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Hạng VIP
              </h2>
              {thongTin.hangVip ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{thongTin.hangVip.icon || '⭐'}</span>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: thongTin.hangVip.mauSac || '#9333ea' }}>
                        {thongTin.hangVip.ten}
                      </p>
                      {thongTin.hangVip.moTa && (
                        <p className="text-gray-600 text-sm">{thongTin.hangVip.moTa}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Tỷ lệ tích điểm: {thongTin.hangVip.tiLeTichDiem}x
                    </p>
                    {thongTin.hangVip.tiLeGiamGia > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        Giảm giá: {thongTin.hangVip.tiLeGiamGia}%
                      </p>
                    )}
                    {thongTin.hangVip.diemToiThieu !== undefined && (
                      <p className="text-sm text-gray-600">
                        Điểm tối thiểu: {thongTin.hangVip.diemToiThieu.toLocaleString('vi-VN')} điểm
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có hạng VIP</p>
              )}

              {/* Progress bar hạng tiếp theo */}
              {thongTin.hangVipTiepTheo && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Hạng tiếp theo: <span className="font-bold">{thongTin.hangVipTiepTheo.ten}</span>
                    {thongTin.hangVipTiepTheo.diemToiThieu !== undefined && (
                      <span className="text-gray-500 ml-2">
                        ({thongTin.hangVipTiepTheo.diemToiThieu.toLocaleString('vi-VN')} điểm)
                      </span>
                    )}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(thongTin.tiLeHoanThanh, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Còn {thongTin.diemConLai.toLocaleString('vi-VN')} điểm để lên hạng
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lịch sử điểm */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Lịch sử điểm
          </h2>
          {lichSu.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có lịch sử điểm</p>
          ) : (
            <div className="space-y-4">
              {lichSu.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-pink-100/50 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getLoaiIcon(item.loai)}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.moTa}</p>
                      <p className="text-sm text-gray-500">{formatDate(item.ngayTao)}</p>
                      {item.ghiChu && (
                        <p className="text-xs text-gray-400 mt-1">{item.ghiChu}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        item.soDiem > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.soDiem > 0 ? '+' : ''}
                      {item.soDiem.toLocaleString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tổng: {item.diemSau.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-gray-700">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TichDiem;

