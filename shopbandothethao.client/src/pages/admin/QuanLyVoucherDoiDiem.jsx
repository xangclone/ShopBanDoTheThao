import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyVoucherDoiDiem() {
  const [vouchers, setVouchers] = useState([]);
  const [maGiamGia, setMaGiamGia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    hinhAnh: '',
    soDiemCanDoi: 0,
    loaiVoucher: 'MaGiamGia',
    maGiamGiaId: null,
    loaiGiamGia: 'PhanTram',
    giaTriGiamGia: 0,
    giaTriDonHangToiThieu: null,
    giaTriGiamGiaToiDa: null,
    soLuong: 0,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
    dangHoatDong: true,
    thuTuHienThi: 0,
  });

  useEffect(() => {
    loadData();
    loadMaGiamGia();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachVoucherDoiDiem();
      setVouchers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const loadMaGiamGia = async () => {
    try {
      const data = await adminService.getDanhSachMaGiamGia();
      setMaGiamGia(data);
    } catch (error) {
      console.error('Không thể tải danh sách mã giảm giá');
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ten: item.ten || '',
        moTa: item.moTa || '',
        hinhAnh: item.hinhAnh || '',
        soDiemCanDoi: item.soDiemCanDoi || 0,
        loaiVoucher: item.loaiVoucher || 'MaGiamGia',
        maGiamGiaId: item.maGiamGiaId || null,
        loaiGiamGia: item.loaiGiamGia || 'PhanTram',
        giaTriGiamGia: item.giaTriGiamGia || 0,
        giaTriDonHangToiThieu: item.giaTriDonHangToiThieu || null,
        giaTriGiamGiaToiDa: item.giaTriGiamGiaToiDa || null,
        soLuong: item.soLuong || 0,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc).toISOString().split('T')[0] : '',
        dangHoatDong: item.dangHoatDong ?? true,
        thuTuHienThi: item.thuTuHienThi || 0,
      });
      setEditingId(item.id);
    } else {
      setFormData({
        ten: '',
        moTa: '',
        hinhAnh: '',
        soDiemCanDoi: 0,
        loaiVoucher: 'MaGiamGia',
        maGiamGiaId: null,
        loaiGiamGia: 'PhanTram',
        giaTriGiamGia: 0,
        giaTriDonHangToiThieu: null,
        giaTriGiamGiaToiDa: null,
        soLuong: 0,
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
        dangHoatDong: true,
        thuTuHienThi: 0,
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
        soDiemCanDoi: parseInt(formData.soDiemCanDoi),
        maGiamGiaId: formData.maGiamGiaId ? parseInt(formData.maGiamGiaId) : null,
        giaTriGiamGia: formData.giaTriGiamGia ? parseFloat(formData.giaTriGiamGia) : null,
        giaTriDonHangToiThieu: formData.giaTriDonHangToiThieu ? parseFloat(formData.giaTriDonHangToiThieu) : null,
        giaTriGiamGiaToiDa: formData.giaTriGiamGiaToiDa ? parseFloat(formData.giaTriGiamGiaToiDa) : null,
        soLuong: parseInt(formData.soLuong),
        thuTuHienThi: parseInt(formData.thuTuHienThi),
        ngayBatDau: new Date(formData.ngayBatDau).toISOString(),
        ngayKetThuc: formData.ngayKetThuc ? new Date(formData.ngayKetThuc).toISOString() : null,
      };

      if (editingId) {
        await adminService.capNhatVoucherDoiDiem(editingId, dataToSend);
        toast.success('Cập nhật voucher thành công!');
      } else {
        await adminService.taoVoucherDoiDiem(dataToSend);
        toast.success('Tạo voucher thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      return;
    }
    try {
      await adminService.xoaVoucherDoiDiem(id);
      toast.success('Xóa voucher thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa voucher');
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
          Quản lý Voucher đổi điểm
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm voucher
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm cần đổi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã đổi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {vouchers.map((v) => (
              <tr key={v.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{v.ten}</div>
                  {v.moTa && (
                    <div className="text-xs text-gray-500 mt-1">{v.moTa}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.soDiemCanDoi.toLocaleString('vi-VN')} điểm
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.loaiVoucher === 'MaGiamGia' ? 'Mã giảm giá' : v.loaiVoucher}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.giaTriGiamGia 
                    ? (v.loaiGiamGia === 'PhanTram' 
                        ? `${v.giaTriGiamGia}%`
                        : formatPrice(v.giaTriGiamGia))
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.soLuong}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.soLuongDaDoi} / {v.soLuong}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(v.ngayBatDau)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.ngayKetThuc ? (
                    <span className={isExpired(v.ngayKetThuc) ? 'text-red-600' : ''}>
                      {formatDate(v.ngayKetThuc)}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    !v.dangHoatDong || (v.ngayKetThuc && isExpired(v.ngayKetThuc)) || v.soLuongDaDoi >= v.soLuong
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {!v.dangHoatDong || (v.ngayKetThuc && isExpired(v.ngayKetThuc)) || v.soLuongDaDoi >= v.soLuong
                      ? 'Không hoạt động'
                      : 'Hoạt động'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(v)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
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
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa voucher' : 'Thêm voucher mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên voucher *</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số điểm cần đổi *</label>
                  <input
                    type="number"
                    value={formData.soDiemCanDoi}
                    onChange={(e) => setFormData({ ...formData, soDiemCanDoi: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng *</label>
                  <input
                    type="number"
                    value={formData.soLuong}
                    onChange={(e) => setFormData({ ...formData, soLuong: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loại voucher *</label>
                <select
                  value={formData.loaiVoucher}
                  onChange={(e) => setFormData({ ...formData, loaiVoucher: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="MaGiamGia">Mã giảm giá</option>
                  <option value="SanPhamMienPhi">Sản phẩm miễn phí</option>
                  <option value="QuaTang">Quà tặng</option>
                </select>
              </div>

              {formData.loaiVoucher === 'MaGiamGia' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Liên kết với mã giảm giá có sẵn</label>
                    <select
                      value={formData.maGiamGiaId || ''}
                      onChange={(e) => setFormData({ ...formData, maGiamGiaId: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Chọn mã giảm giá --</option>
                      {maGiamGia.map((mg) => (
                        <option key={mg.id} value={mg.id}>{mg.ma} - {mg.moTa}</option>
                      ))}
                    </select>
                  </div>

                  {!formData.maGiamGiaId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Loại giảm giá</label>
                        <select
                          value={formData.loaiGiamGia}
                          onChange={(e) => setFormData({ ...formData, loaiGiamGia: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="PhanTram">Phần trăm (%)</option>
                          <option value="SoTien">Số tiền (VNĐ)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Giá trị giảm giá *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.giaTriGiamGia}
                            onChange={(e) => setFormData({ ...formData, giaTriGiamGia: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Đơn hàng tối thiểu</label>
                          <input
                            type="number"
                            value={formData.giaTriDonHangToiThieu || ''}
                            onChange={(e) => setFormData({ ...formData, giaTriDonHangToiThieu: e.target.value ? parseFloat(e.target.value) : null })}
                            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Giảm tối đa</label>
                          <input
                            type="number"
                            value={formData.giaTriGiamGiaToiDa || ''}
                            onChange={(e) => setFormData({ ...formData, giaTriGiamGiaToiDa: e.target.value ? parseFloat(e.target.value) : null })}
                            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="grid grid-cols-3 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={formData.thuTuHienThi}
                    onChange={(e) => setFormData({ ...formData, thuTuHienThi: parseInt(e.target.value) || 0 })}
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

export default QuanLyVoucherDoiDiem;








