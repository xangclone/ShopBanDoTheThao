import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyMinigame() {
  const [minigames, setMinigames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    loaiGame: 'VongQuayMayMan',
    hinhAnh: '',
    soDiemCanThi: 0,
    soLanChoiToiDa: 1,
    dangHoatDong: true,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachMinigame();
      setMinigames(data);
    } catch (error) {
      toast.error('Không thể tải danh sách minigame');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ten: item.ten || '',
        moTa: item.moTa || '',
        loaiGame: item.loaiGame || 'VongQuayMayMan',
        hinhAnh: item.hinhAnh || '',
        soDiemCanThi: item.soDiemCanThi || 0,
        soLanChoiToiDa: item.soLanChoiToiDa || 1,
        dangHoatDong: item.dangHoatDong ?? true,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc).toISOString().split('T')[0] : '',
      });
      setEditingId(item.id);
    } else {
      setFormData({
        ten: '',
        moTa: '',
        loaiGame: 'VongQuayMayMan',
        hinhAnh: '',
        soDiemCanThi: 0,
        soLanChoiToiDa: 1,
        dangHoatDong: true,
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
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
        soDiemCanThi: parseInt(formData.soDiemCanThi),
        soLanChoiToiDa: parseInt(formData.soLanChoiToiDa),
        ngayBatDau: new Date(formData.ngayBatDau).toISOString(),
        ngayKetThuc: formData.ngayKetThuc ? new Date(formData.ngayKetThuc).toISOString() : null,
      };

      if (editingId) {
        await adminService.capNhatMinigame(editingId, dataToSend);
        toast.success('Cập nhật minigame thành công!');
      } else {
        await adminService.taoMinigame(dataToSend);
        toast.success('Tạo minigame thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa minigame này?')) {
      return;
    }
    try {
      await adminService.xoaMinigame(id);
      toast.success('Xóa minigame thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa minigame');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isExpired = (ngayKetThuc) => {
    if (!ngayKetThuc) return false;
    return new Date(ngayKetThuc) < new Date();
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Minigame
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm minigame
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm cần thi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lần chơi tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {minigames.map((mg) => (
              <tr key={mg.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{mg.ten}</div>
                  {mg.moTa && (
                    <div className="text-xs text-gray-500 mt-1">{mg.moTa}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.loaiGame === 'VongQuayMayMan' ? 'Vòng quay may mắn' : mg.loaiGame}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.soDiemCanThi > 0 ? `${mg.soDiemCanThi.toLocaleString('vi-VN')} điểm` : 'Miễn phí'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.soLanChoiToiDa} lần
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(mg.ngayBatDau)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.ngayKetThuc ? (
                    <span className={isExpired(mg.ngayKetThuc) ? 'text-red-600' : ''}>
                      {formatDate(mg.ngayKetThuc)}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    !mg.dangHoatDong || (mg.ngayKetThuc && isExpired(mg.ngayKetThuc))
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {!mg.dangHoatDong || (mg.ngayKetThuc && isExpired(mg.ngayKetThuc))
                      ? 'Không hoạt động'
                      : 'Hoạt động'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(mg)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(mg.id)}
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
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa minigame' : 'Thêm minigame mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên minigame *</label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
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

              <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loại game *</label>
                <select
                  value={formData.loaiGame}
                  onChange={(e) => setFormData({ ...formData, loaiGame: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="VongQuayMayMan">Vòng quay may mắn</option>
                  <option value="LatThe">Lật thẻ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Điểm cần thi</label>
                  <input
                    type="number"
                    value={formData.soDiemCanThi}
                    onChange={(e) => setFormData({ ...formData, soDiemCanThi: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">0 = miễn phí</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lần chơi tối đa</label>
                  <input
                    type="number"
                    value={formData.soLanChoiToiDa}
                    onChange={(e) => setFormData({ ...formData, soLanChoiToiDa: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.ngayKetThuc}
                    onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
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

export default QuanLyMinigame;








