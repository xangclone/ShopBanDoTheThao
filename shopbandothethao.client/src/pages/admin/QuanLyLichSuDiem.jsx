import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyLichSuDiem() {
  const [lichSu, setLichSu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    nguoiDungId: '',
    loai: '',
  });

  useEffect(() => {
    loadData();
  }, [page, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getLichSuDiem(
        filters.nguoiDungId ? parseInt(filters.nguoiDungId) : null,
        filters.loai || null,
        page,
        20
      );
      setLichSu(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải lịch sử điểm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const getLoaiLabel = (loai) => {
    const labels = {
      TichDiem: 'Tích điểm',
      SuDung: 'Sử dụng',
      DoiVoucher: 'Đổi voucher',
      Minigame: 'Minigame',
      Thuong: 'Thưởng',
    };
    return labels[loai] || loai;
  };

  const getLoaiColor = (loai) => {
    const colors = {
      TichDiem: 'bg-green-100 text-green-800',
      SuDung: 'bg-red-100 text-red-800',
      DoiVoucher: 'bg-blue-100 text-blue-800',
      Minigame: 'bg-purple-100 text-purple-800',
      Thuong: 'bg-yellow-100 text-yellow-800',
    };
    return colors[loai] || 'bg-gray-100 text-gray-800';
  };

  if (loading && lichSu.length === 0) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Lịch sử Điểm
        </h1>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID Người dùng</label>
            <input
              type="number"
              value={filters.nguoiDungId}
              onChange={(e) => handleFilterChange('nguoiDungId', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Lọc theo ID người dùng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
            <select
              value={filters.loai}
              onChange={(e) => handleFilterChange('loai', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tất cả</option>
              <option value="TichDiem">Tích điểm</option>
              <option value="SuDung">Sử dụng</option>
              <option value="DoiVoucher">Đổi voucher</option>
              <option value="Minigame">Minigame</option>
              <option value="Thuong">Thưởng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điểm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm trước</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm sau</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên quan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {lichSu.map((ls) => (
              <tr key={ls.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ls.nguoiDung?.ho} {ls.nguoiDung?.ten}
                  </div>
                  <div className="text-xs text-gray-500">ID: {ls.nguoiDungId}</div>
                  {ls.nguoiDung?.email && (
                    <div className="text-xs text-gray-500">{ls.nguoiDung.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getLoaiColor(ls.loai)}`}>
                    {getLoaiLabel(ls.loai)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{ls.moTa}</div>
                  {ls.ghiChu && (
                    <div className="text-xs text-gray-500 mt-1">{ls.ghiChu}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    ls.soDiem > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {ls.soDiem > 0 ? '+' : ''}{ls.soDiem.toLocaleString('vi-VN')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ls.diemTruoc.toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ls.diemSau.toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ls.donHang && (
                    <div>Đơn hàng: {ls.donHang.maDonHang}</div>
                  )}
                  {ls.voucherDoiDiem && (
                    <div>Voucher: {ls.voucherDoiDiem.ten}</div>
                  )}
                  {ls.minigame && (
                    <div>Minigame: {ls.minigame.ten}</div>
                  )}
                  {!ls.donHang && !ls.voucherDoiDiem && !ls.minigame && '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(ls.ngayTao)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="backdrop-blur-md bg-white/40 text-gray-700 px-4 py-2 rounded-lg hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed border border-white/50 transition-all duration-300"
          >
            Trước
          </button>
          <span className="text-sm text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="backdrop-blur-md bg-white/40 text-gray-700 px-4 py-2 rounded-lg hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed border border-white/50 transition-all duration-300"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default QuanLyLichSuDiem;








