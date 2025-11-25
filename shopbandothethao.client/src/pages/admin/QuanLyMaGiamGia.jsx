import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyMaGiamGia() {
  const [maGiamGia, setMaGiamGia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ma: '',
    moTa: '',
    loaiGiamGia: 'PhanTram',
    giaTriGiamGia: 0,
    giaTriDonHangToiThieu: null,
    giaTriGiamGiaToiDa: null,
    soLuongSuDung: null,
    ngayBatDau: '',
    ngayKetThuc: '',
    dangHoatDong: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachMaGiamGia();
      setMaGiamGia(data);
    } catch (error) {
      toast.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ma: item.ma || '',
        moTa: item.moTa || '',
        loaiGiamGia: item.loaiGiamGia || 'PhanTram',
        giaTriGiamGia: item.giaTriGiamGia || 0,
        giaTriDonHangToiThieu: item.giaTriDonHangToiThieu || null,
        giaTriGiamGiaToiDa: item.giaTriGiamGiaToiDa || null,
        soLuongSuDung: item.soLuongSuDung || null,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau).toISOString().split('T')[0] : '',
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc).toISOString().split('T')[0] : '',
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingId(item.id);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];
      
      setFormData({
        ma: '',
        moTa: '',
        loaiGiamGia: 'PhanTram',
        giaTriGiamGia: 0,
        giaTriDonHangToiThieu: null,
        giaTriGiamGiaToiDa: null,
        soLuongSuDung: null,
        ngayBatDau: today,
        ngayKetThuc: nextMonthStr,
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
        giaTriGiamGia: parseFloat(formData.giaTriGiamGia),
        giaTriDonHangToiThieu: formData.giaTriDonHangToiThieu ? parseFloat(formData.giaTriDonHangToiThieu) : null,
        giaTriGiamGiaToiDa: formData.giaTriGiamGiaToiDa ? parseFloat(formData.giaTriGiamGiaToiDa) : null,
        soLuongSuDung: formData.soLuongSuDung ? parseInt(formData.soLuongSuDung) : null,
        ngayBatDau: new Date(formData.ngayBatDau).toISOString(),
        ngayKetThuc: new Date(formData.ngayKetThuc).toISOString(),
      };

      if (editingId) {
        await adminService.capNhatMaGiamGia(editingId, dataToSend);
        toast.success('Cập nhật mã giảm giá thành công!');
      } else {
        await adminService.taoMaGiamGia(dataToSend);
        toast.success('Tạo mã giảm giá thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      return;
    }
    try {
      await adminService.xoaMaGiamGia(id);
      toast.success('Xóa mã giảm giá thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isExpired = (ngayKetThuc) => {
    return new Date(ngayKetThuc) < new Date();
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý mã giảm giá
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm mã giảm giá
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {maGiamGia.map((mg) => (
              <tr key={mg.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{mg.ma}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{mg.moTa || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.loaiGiamGia === 'PhanTram' ? 'Phần trăm' : 'Số tiền'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.loaiGiamGia === 'PhanTram' 
                    ? `${mg.giaTriGiamGia}%`
                    : formatPrice(mg.giaTriGiamGia)
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mg.soLuongSuDung 
                    ? `${mg.soLuongDaSuDung} / ${mg.soLuongSuDung}`
                    : `${mg.soLuongDaSuDung} / ∞`
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(mg.ngayBatDau)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={isExpired(mg.ngayKetThuc) ? 'text-red-600' : ''}>
                    {formatDate(mg.ngayKetThuc)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    !mg.dangHoatDong || isExpired(mg.ngayKetThuc)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {!mg.dangHoatDong || isExpired(mg.ngayKetThuc) ? 'Không hoạt động' : 'Hoạt động'}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã giảm giá *</label>
                  <input
                    type="text"
                    required
                    value={formData.ma}
                    onChange={(e) => setFormData(prev => ({ ...prev, ma: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="VD: SALE10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại giảm giá *</label>
                  <select
                    required
                    value={formData.loaiGiamGia}
                    onChange={(e) => setFormData(prev => ({ ...prev, loaiGiamGia: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="PhanTram">Phần trăm (%)</option>
                    <option value="SoTien">Số tiền (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá trị giảm giá *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.loaiGiamGia === 'PhanTram' ? '1' : '1000'}
                    value={formData.giaTriGiamGia}
                    onChange={(e) => setFormData(prev => ({ ...prev, giaTriGiamGia: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={formData.loaiGiamGia === 'PhanTram' ? '10' : '50000'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.giaTriDonHangToiThieu || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, giaTriDonHangToiThieu: e.target.value || null }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giảm tối đa</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.giaTriGiamGiaToiDa || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, giaTriGiamGiaToiDa: e.target.value || null }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Số lượng sử dụng</label>
                <input
                  type="number"
                  min="0"
                  value={formData.soLuongSuDung || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, soLuongSuDung: e.target.value || null }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Không giới hạn"
                />
                <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={formData.ngayBatDau}
                    onChange={(e) => setFormData(prev => ({ ...prev, ngayBatDau: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={formData.ngayKetThuc}
                    onChange={(e) => setFormData(prev => ({ ...prev, ngayKetThuc: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
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

export default QuanLyMaGiamGia;



