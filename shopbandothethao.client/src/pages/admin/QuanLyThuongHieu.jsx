import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyThuongHieu() {
  const [thuongHieu, setThuongHieu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    logo: '',
    trangWeb: '',
    dangHoatDong: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachThuongHieu();
      setThuongHieu(data);
    } catch (error) {
      toast.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ten: item.ten || '',
        moTa: item.moTa || '',
        logo: item.logo || '',
        trangWeb: item.trangWeb || '',
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingId(item.id);
    } else {
      setFormData({
        ten: '',
        moTa: '',
        logo: '',
        trangWeb: '',
        dangHoatDong: true,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.capNhatThuongHieu(editingId, formData);
        toast.success('Cập nhật thương hiệu thành công!');
      } else {
        await adminService.taoThuongHieu(formData);
        toast.success('Tạo thương hiệu thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return;
    }
    try {
      await adminService.xoaThuongHieu(id);
      toast.success('Xóa thương hiệu thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa thương hiệu');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý thương hiệu
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm thương hiệu
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên thương hiệu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {thuongHieu.map((th) => (
              <tr key={th.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  {th.logo ? (
                    <img src={th.logo} alt={th.ten} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      No Logo
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{th.ten}</div>
                  {th.moTa && <div className="text-sm text-gray-500">{th.moTa}</div>}
                  {th.trangWeb && (
                    <a href={th.trangWeb} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {th.trangWeb}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{th.soSanPham}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${th.dangHoatDong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {th.dangHoatDong ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(th)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(th.id)}
                    className="backdrop-blur-md bg-red-500/20 text-red-700 hover:bg-red-500/30 px-4 py-2 rounded-lg border border-red-300/30 transition-all duration-300 font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên thương hiệu *</label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={(e) => setFormData(prev => ({ ...prev, ten: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Logo (URL)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trang web</label>
                <input
                  type="url"
                  value={formData.trangWeb}
                  onChange={(e) => setFormData(prev => ({ ...prev, trangWeb: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dangHoatDong}
                    onChange={(e) => setFormData(prev => ({ ...prev, dangHoatDong: e.target.checked }))}
                    className="mr-2"
                  />
                  Đang hoạt động
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyThuongHieu;



