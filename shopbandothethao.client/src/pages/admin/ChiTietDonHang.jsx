import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { HiOutlineArrowLeft, HiOutlineShoppingBag, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineRefresh } from 'react-icons/hi';
import { formatVietnamDateTimeFull } from '../../utils/dateUtils';

function ChiTietDonHang() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'tong';
  const [donHang, setDonHang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadDonHang();
  }, [type, page]);

  const loadDonHang = async () => {
    setLoading(true);
    try {
      let trangThai = null;
      if (type === 'cho-xac-nhan') trangThai = 'ChoXacNhan';
      else if (type === 'dang-giao') trangThai = 'DangGiao';
      else if (type === 'da-huy') trangThai = 'DaHuy';
      else if (type === 'hoan-tra') trangThai = 'HoanTra';
      else if (type === 'da-giao') trangThai = 'DaGiao';

      const data = await adminService.getDanhSachDonHang(trangThai, page, pageSize);
      setDonHang(data.data || data || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getTrangThaiBadge = (trangThai) => {
    const badges = {
      ChoXacNhan: 'bg-yellow-100 text-yellow-800',
      DaXacNhan: 'bg-blue-100 text-blue-800',
      DangGiao: 'bg-purple-100 text-purple-800',
      DaGiao: 'bg-green-100 text-green-800',
      DaHuy: 'bg-red-100 text-red-800',
      HoanTra: 'bg-orange-100 text-orange-800',
    };
    return badges[trangThai] || 'bg-gray-100 text-gray-800';
  };

  const getTrangThaiText = (trangThai) => {
    const texts = {
      ChoXacNhan: 'Chờ xác nhận',
      DaXacNhan: 'Đã xác nhận',
      DangGiao: 'Đang giao',
      DaGiao: 'Đã giao',
      DaHuy: 'Đã hủy',
      HoanTra: 'Hoàn trả',
    };
    return texts[trangThai] || trangThai;
  };

  const getTitle = () => {
    const titles = {
      'tong': 'Tất cả đơn hàng',
      'cho-xac-nhan': 'Đơn hàng chờ xác nhận',
      'dang-giao': 'Đơn hàng đang giao',
      'da-giao': 'Đơn hàng đã giao',
      'da-huy': 'Đơn hàng đã hủy',
      'hoan-tra': 'Đơn hàng hoàn trả',
    };
    return titles[type] || 'Đơn hàng';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 hover:bg-white/30 rounded-xl transition-all"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {getTitle()}
        </h1>
      </div>

      {/* Thống kê */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng số đơn hàng</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {totalCount}
            </p>
          </div>
          <HiOutlineShoppingBag className="w-16 h-16 text-indigo-600 opacity-30" />
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left p-3 font-semibold text-gray-700">Mã đơn</th>
                <th className="text-left p-3 font-semibold text-gray-700">Khách hàng</th>
                <th className="text-left p-3 font-semibold text-gray-700">Ngày đặt</th>
                <th className="text-left p-3 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-right p-3 font-semibold text-gray-700">Tổng tiền</th>
                <th className="text-center p-3 font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {donHang.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                donHang.map((dh) => (
                  <tr key={dh.id} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                    <td className="p-3">
                      <span className="font-semibold text-gray-800">{dh.maDonHang || dh.MaDonHang}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-800">
                          {dh.nguoiDung?.ho || dh.NguoiDung?.Ho} {dh.nguoiDung?.ten || dh.NguoiDung?.Ten}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dh.nguoiDung?.email || dh.NguoiDung?.Email}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700">
                      {formatVietnamDateTimeFull(new Date(dh.ngayDat || dh.NgayDat))}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTrangThaiBadge(dh.trangThai || dh.TrangThai)}`}>
                        {getTrangThaiText(dh.trangThai || dh.TrangThai)}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-blue-600">
                      {formatPrice(dh.tongTien || dh.TongTien)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const maDonHang = dh.maDonHang || dh.MaDonHang;
                          navigate(`/admin/don-hang?maDonHang=${maDonHang}`);
                        }}
                        className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 font-semibold transition-all shadow-lg hover:shadow-xl"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-all"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-gray-700 font-semibold">
              Trang {page} / {Math.ceil(totalCount / pageSize)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
              disabled={page >= Math.ceil(totalCount / pageSize)}
              className="px-4 py-2 bg-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-all"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChiTietDonHang;

