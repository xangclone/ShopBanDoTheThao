import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../../components/ImageWithFallback';

function QuanLyBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    tieuDe: '',
    moTa: '',
    hinhAnh: '',
    lienKet: '',
    nutBam: '',
    thuTuHienThi: 0,
    dangHoatDong: true,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadBanners();
  }, [page]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachBanner(page, 20);
      setBanners(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải danh sách banner');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        tieuDe: banner.tieuDe || '',
        moTa: banner.moTa || '',
        hinhAnh: banner.hinhAnh || '',
        lienKet: banner.lienKet || '',
        nutBam: banner.nutBam || '',
        thuTuHienThi: banner.thuTuHienThi || 0,
        dangHoatDong: banner.dangHoatDong !== undefined ? banner.dangHoatDong : true,
        ngayBatDau: banner.ngayBatDau ? new Date(banner.ngayBatDau).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ngayKetThuc: banner.ngayKetThuc ? new Date(banner.ngayKetThuc).toISOString().split('T')[0] : '',
      });
      setImagePreview(banner.hinhAnh ? getImageUrl(banner.hinhAnh) : '');
    } else {
      setEditingBanner(null);
      setFormData({
        tieuDe: '',
        moTa: '',
        hinhAnh: '',
        lienKet: '',
        nutBam: '',
        thuTuHienThi: 0,
        dangHoatDong: true,
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
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
      // Tạo preview từ file local
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      try {
        const uploadedImage = await adminService.uploadImage(file);
        // Cập nhật formData với URL từ server
        setFormData({ ...formData, hinhAnh: uploadedImage.url || uploadedImage.path || uploadedImage });
        // Giải phóng blob URL cũ và cập nhật preview với URL từ server
        if (previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        // Nếu có URL từ server, dùng nó; nếu không, giữ blob URL
        if (uploadedImage.url || uploadedImage.path) {
          setImagePreview(uploadedImage.url || uploadedImage.path);
        }
      } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        toast.error(error.response?.data?.message || 'Không thể tải ảnh lên');
        // Giữ preview từ file local nếu upload thất bại
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await adminService.capNhatBanner(editingBanner.id, formData);
        toast.success('Cập nhật banner thành công');
      } else {
        await adminService.taoBanner(formData);
        toast.success('Tạo banner thành công');
      }
      setShowModal(false);
      loadBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;
    
    try {
      await adminService.xoaBanner(id);
      toast.success('Xóa banner thành công');
      loadBanners();
    } catch (error) {
      toast.error('Không thể xóa banner');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Banner
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm Banner
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
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-white/40 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ImageWithFallback
                        src={banner.hinhAnh}
                        alt={banner.tieuDe || 'Banner'}
                        className="h-16 w-32 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{banner.tieuDe}</div>
                      {banner.moTa && (
                        <div className="text-sm text-gray-500 line-clamp-1">{banner.moTa}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.thuTuHienThi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.dangHoatDong
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {banner.dangHoatDong ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.ngayBatDau).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.ngayKetThuc
                        ? new Date(banner.ngayKetThuc).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(banner)}
                        className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
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
                  {editingBanner ? 'Sửa Banner' : 'Thêm Banner'}
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
                  <label className="block text-sm font-medium mb-2">Mô tả</label>
                  <textarea
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hình ảnh *</label>
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
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden h-32 w-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
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
                    {editingBanner ? 'Cập nhật' : 'Tạo'}
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

export default QuanLyBanner;



