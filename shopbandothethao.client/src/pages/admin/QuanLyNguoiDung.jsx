import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyNguoiDung() {
  const [nguoiDung, setNguoiDung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timKiem: '',
    page: 1,
    pageSize: 20,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachNguoiDung(
        filters.timKiem || undefined,
        filters.page,
        filters.pageSize
      );
      setNguoiDung(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminService.capNhatTrangThaiNguoiDung(id, !currentStatus);
      toast.success('Cập nhật trạng thái thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Quản lý người dùng
      </h1>

      {/* Filter */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo email, tên..."
          value={filters.timKiem}
          onChange={(e) => setFilters(prev => ({ ...prev, timKiem: e.target.value, page: 1 }))}
          className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {nguoiDung.map((user) => (
              <tr key={user.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.ho} {user.ten}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.soDienThoai || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.vaiTro === 'QuanTriVien' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.vaiTro === 'QuanTriVien' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.soDonHang || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.ngayTao)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.dangHoatDong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.dangHoatDong ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.dangHoatDong)}
                    className={`backdrop-blur-md px-4 py-2 rounded-lg border transition-all duration-300 font-medium ${
                      user.dangHoatDong 
                        ? 'bg-red-500/20 text-red-700 hover:bg-red-500/30 border-red-300/30' 
                        : 'bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-300/30'
                    }`}
                  >
                    {user.dangHoatDong ? 'Khóa' : 'Mở khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          disabled={filters.page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-gray-700">
          Trang {filters.page} / {totalPages}
        </span>
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          disabled={filters.page === totalPages}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export default QuanLyNguoiDung;



