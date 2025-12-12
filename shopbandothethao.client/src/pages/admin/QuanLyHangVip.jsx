import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyHangVip() {
  const [hangVip, setHangVip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    mauSac: '#9333ea',
    icon: '⭐',
    diemToiThieu: 0,
    diemToiDa: 2147483647,
    tiLeTichDiem: 1.0,
    tiLeGiamGia: 0,
    thuTu: 0,
    dangHoatDong: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachHangVip();
      setHangVip(data);
    } catch (error) {
      toast.error('Không thể tải danh sách hạng VIP');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ten: item.ten || '',
        moTa: item.moTa || '',
        mauSac: item.mauSac || '#9333ea',
        icon: item.icon || '⭐',
        diemToiThieu: item.diemToiThieu || 0,
        diemToiDa: item.diemToiDa || 2147483647,
        tiLeTichDiem: item.tiLeTichDiem || 1.0,
        tiLeGiamGia: item.tiLeGiamGia || 0,
        thuTu: item.thuTu || 0,
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingId(item.id);
    } else {
      setFormData({
        ten: '',
        moTa: '',
        mauSac: '#9333ea',
        icon: '⭐',
        diemToiThieu: 0,
        diemToiDa: 2147483647,
        tiLeTichDiem: 1.0,
        tiLeGiamGia: 0,
        thuTu: 0,
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
        diemToiThieu: parseInt(formData.diemToiThieu),
        diemToiDa: formData.diemToiDa === 2147483647 ? 2147483647 : parseInt(formData.diemToiDa),
        tiLeTichDiem: parseFloat(formData.tiLeTichDiem),
        tiLeGiamGia: parseFloat(formData.tiLeGiamGia),
        thuTu: parseInt(formData.thuTu),
      };

      if (editingId) {
        await adminService.capNhatHangVip(editingId, dataToSend);
        toast.success('Cập nhật hạng VIP thành công!');
      } else {
        await adminService.taoHangVip(dataToSend);
        toast.success('Tạo hạng VIP thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hạng VIP này?')) {
      return;
    }
    try {
      await adminService.xoaHangVip(id);
      toast.success('Xóa hạng VIP thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa hạng VIP');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Hạng VIP
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm hạng VIP
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm tối thiểu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỷ lệ tích điểm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {hangVip.map((hv) => (
              <tr key={hv.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hv.thuTu}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-2xl">{hv.icon || '⭐'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium" style={{ color: hv.mauSac || '#9333ea' }}>
                    {hv.ten}
                  </div>
                  {hv.moTa && (
                    <div className="text-xs text-gray-500 mt-1">{hv.moTa}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hv.diemToiThieu.toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hv.diemToiDa === 2147483647 ? '∞' : hv.diemToiDa.toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hv.tiLeTichDiem}x
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hv.tiLeGiamGia}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    hv.dangHoatDong
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {hv.dangHoatDong ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(hv)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(hv.id)}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa hạng VIP' : 'Thêm hạng VIP mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên hạng VIP *</label>
                  <input
                    type="text"
                    value={formData.ten}
                    onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="⭐"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <input
                    type="color"
                    value={formData.mauSac}
                    onChange={(e) => setFormData({ ...formData, mauSac: e.target.value })}
                    className="w-full h-10 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thứ tự</label>
                  <input
                    type="number"
                    value={formData.thuTu}
                    onChange={(e) => setFormData({ ...formData, thuTu: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Điểm tối thiểu *</label>
                  <input
                    type="number"
                    value={formData.diemToiThieu}
                    onChange={(e) => setFormData({ ...formData, diemToiThieu: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Điểm tối đa</label>
                  <input
                    type="number"
                    value={formData.diemToiDa === 2147483647 ? '' : formData.diemToiDa}
                    onChange={(e) => setFormData({ ...formData, diemToiDa: e.target.value === '' ? 2147483647 : parseInt(e.target.value) || 2147483647 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Để trống = không giới hạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tỷ lệ tích điểm *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tiLeTichDiem}
                    onChange={(e) => setFormData({ ...formData, tiLeTichDiem: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Ví dụ: 1.5 = tích điểm nhanh hơn 50%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tỷ lệ giảm giá (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tiLeGiamGia}
                    onChange={(e) => setFormData({ ...formData, tiLeGiamGia: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dangHoatDong}
                  onChange={(e) => setFormData({ ...formData, dangHoatDong: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm font-medium">Đang hoạt động</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 backdrop-blur-xl bg-white/40 text-gray-700 px-6 py-3 rounded-xl hover:bg-white/60 font-semibold border border-white/50 transition-all duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyHangVip;








