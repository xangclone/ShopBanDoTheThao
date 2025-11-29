import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../../components/ImageWithFallback';

function QuanLyPopup() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [formData, setFormData] = useState({
    tieuDe: '',
    noiDung: '',
    hinhAnh: '',
    lienKet: '',
    nutBam: '',
    loaiPopup: 'ThongBao',
    thuTuHienThi: 0,
    dangHoatDong: true,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
    hienThiMotLan: false,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadPopups();
  }, [page]);

  const loadPopups = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachPopup(page, 20);
      setPopups(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải danh sách popup');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (popup = null) => {
    if (popup) {
      setEditingPopup(popup);
      setFormData({
        tieuDe: popup.tieuDe || '',
        noiDung: popup.noiDung || '',
        hinhAnh: popup.hinhAnh || '',
        lienKet: popup.lienKet || '',
        nutBam: popup.nutBam || '',
        loaiPopup: popup.loaiPopup || 'ThongBao',
        thuTuHienThi: popup.thuTuHienThi || 0,
        dangHoatDong: popup.dangHoatDong !== undefined ? popup.dangHoatDong : true,
        ngayBatDau: popup.ngayBatDau ? new Date(popup.ngayBatDau).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ngayKetThuc: popup.ngayKetThuc ? new Date(popup.ngayKetThuc).toISOString().split('T')[0] : '',
        hienThiMotLan: popup.hienThiMotLan || false,
      });
      setImagePreview(popup.hinhAnh ? getImageUrl(popup.hinhAnh) : '');
    } else {
      setEditingPopup(null);
      setFormData({
        tieuDe: '',
        noiDung: '',
        hinhAnh: '',
        lienKet: '',
        nutBam: '',
        loaiPopup: 'ThongBao',
        thuTuHienThi: 0,
        dangHoatDong: true,
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
        hienThiMotLan: false,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      try {
        const uploadedImage = await adminService.uploadImage(file);
        setFormData({ ...formData, hinhAnh: uploadedImage.url || uploadedImage.path || uploadedImage });
        if (previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        if (uploadedImage.url || uploadedImage.path) {
          setImagePreview(uploadedImage.url || uploadedImage.path);
        }
      } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        toast.error(error.response?.data?.message || 'Không thể tải ảnh lên');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPopup) {
        await adminService.capNhatPopup(editingPopup.id, formData);
        toast.success('Cập nhật popup thành công');
      } else {
        await adminService.taoPopup(formData);
        toast.success('Tạo popup thành công');
      }
      setShowModal(false);
      loadPopups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa popup này?')) return;
    
    try {
      await adminService.xoaPopup(id);
      toast.success('Xóa popup thành công');
      loadPopups();
    } catch (error) {
      toast.error('Không thể xóa popup');
    }
  };

  const getLoaiPopupLabel = (loai) => {
    const labels = {
      ThongBao: 'Thông báo',
      KhuyenMai: 'Khuyến mãi',
      CanhBao: 'Cảnh báo',
      QuangCao: 'Quảng cáo',
    };
    return labels[loai] || loai;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Popup
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm Popup
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <table className="min-w-full divide-y divide-white/30">
              <thead className="backdrop-blur-md bg-white/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hiển thị 1 lần
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
                {popups.map((popup) => (
                  <tr key={popup.id} className="hover:bg-white/40 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {popup.hinhAnh ? (
                        <ImageWithFallback
                          src={popup.hinhAnh}
                          alt={popup.tieuDe || 'Popup'}
                          className="h-16 w-32 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          Không có ảnh
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{popup.tieuDe}</div>
                      {popup.noiDung && (
                        <div className="text-sm text-gray-500 line-clamp-1">{popup.noiDung}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getLoaiPopupLabel(popup.loaiPopup)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {popup.thuTuHienThi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          popup.dangHoatDong
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {popup.dangHoatDong ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          popup.hienThiMotLan
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {popup.hienThiMotLan ? 'Có' : 'Không'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(popup)}
                        className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(popup.id)}
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

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPopup ? 'Sửa Popup' : 'Thêm Popup'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
                  <input
                    type="text"
                    required
                    value={formData.tieuDe}
                    onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nội dung</label>
                  <textarea
                    value={formData.noiDung}
                    onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview.startsWith('blob:') || imagePreview.startsWith('http') ? imagePreview : getImageUrl(imagePreview)}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Liên kết</label>
                  <input
                    type="text"
                    value={formData.lienKet}
                    onChange={(e) => setFormData({ ...formData, lienKet: e.target.value })}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="/san-pham hoặc https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Text nút bấm</label>
                  <input
                    type="text"
                    value={formData.nutBam}
                    onChange={(e) => setFormData({ ...formData, nutBam: e.target.value })}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Mua ngay, Xem thêm..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại popup</label>
                    <select
                      value={formData.loaiPopup}
                      onChange={(e) => setFormData({ ...formData, loaiPopup: e.target.value })}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="ThongBao">Thông báo</option>
                      <option value="KhuyenMai">Khuyến mãi</option>
                      <option value="CanhBao">Cảnh báo</option>
                      <option value="QuangCao">Quảng cáo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      value={formData.thuTuHienThi}
                      onChange={(e) =>
                        setFormData({ ...formData, thuTuHienThi: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trạng thái</label>
                    <select
                      value={formData.dangHoatDong}
                      onChange={(e) =>
                        setFormData({ ...formData, dangHoatDong: e.target.value === 'true' })
                      }
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value={true}>Hoạt động</option>
                      <option value={false}>Tạm dừng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hiển thị 1 lần</label>
                    <select
                      value={formData.hienThiMotLan}
                      onChange={(e) =>
                        setFormData({ ...formData, hienThiMotLan: e.target.value === 'true' })
                      }
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value={false}>Không</option>
                      <option value={true}>Có</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
                    <input
                      type="date"
                      required
                      value={formData.ngayBatDau}
                      onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={formData.ngayKetThuc}
                      onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-white/50 rounded-xl hover:bg-white/30 backdrop-blur-md transition-all duration-300 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl border border-white/30 transition-all duration-300 font-semibold"
                  >
                    {editingPopup ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyPopup;





