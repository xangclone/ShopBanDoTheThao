import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyDanhMuc() {
  const [danhMuc, setDanhMuc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    hinhAnh: '',
    danhMucChaId: '',
    thuTuHienThi: 0,
    dangHoatDong: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachDanhMuc();
      setDanhMuc(data);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ten: item.ten || '',
        moTa: item.moTa || '',
        hinhAnh: item.hinhAnh || '',
        danhMucChaId: item.danhMucChaId || '',
        thuTuHienThi: item.thuTuHienThi || 0,
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingId(item.id);
    } else {
      setFormData({
        ten: '',
        moTa: '',
        hinhAnh: '',
        danhMucChaId: '',
        thuTuHienThi: 0,
        dangHoatDong: true,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        danhMucChaId: formData.danhMucChaId ? parseInt(formData.danhMucChaId) : null,
        thuTuHienThi: parseInt(formData.thuTuHienThi),
      };

      if (editingId) {
        await adminService.capNhatDanhMuc(editingId, dataToSend);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await adminService.taoDanhMuc(dataToSend);
        toast.success('Tạo danh mục thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }
    try {
      await adminService.xoaDanhMuc(id);
      toast.success('Xóa danh mục thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý danh mục
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục cha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {danhMuc.map((dm) => (
              <tr key={dm.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{dm.ten}</div>
                  {dm.moTa && <div className="text-sm text-gray-500">{dm.moTa}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dm.danhMucCha?.ten || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dm.soSanPham}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dm.thuTuHienThi}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${dm.dangHoatDong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dm.dangHoatDong ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(dm)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(dm.id)}
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
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
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
                <label className="block text-sm font-medium mb-1">Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData(prev => ({ ...prev, hinhAnh: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Danh mục cha</label>
                <select
                  value={formData.danhMucChaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, danhMucChaId: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Không có</option>
                  {danhMuc.filter(dm => dm.id !== editingId).map(dm => (
                    <option key={dm.id} value={dm.id}>{dm.ten}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  min="0"
                  value={formData.thuTuHienThi}
                  onChange={(e) => setFormData(prev => ({ ...prev, thuTuHienThi: e.target.value }))}
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

export default QuanLyDanhMuc;



