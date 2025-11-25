import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyTinTuc() {
  const [tinTuc, setTinTuc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTinTuc, setEditingTinTuc] = useState(null);
  const [filters, setFilters] = useState({
    loai: '',
    timKiem: '',
  });
  const [formData, setFormData] = useState({
    tieuDe: '',
    tomTat: '',
    noiDung: '',
    hinhAnh: '',
    slug: '',
    loai: 'TinTuc',
    dangHoatDong: true,
    noiBat: false,
    ngayDang: new Date().toISOString().split('T')[0],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadTinTuc();
  }, [page, filters]);

  const loadTinTuc = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachTinTuc(
        filters.loai || undefined,
        filters.timKiem || undefined,
        page,
        20
      );
      setTinTuc(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error('Không thể tải danh sách tin tức');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingTinTuc(item);
      setFormData({
        tieuDe: item.tieuDe || '',
        tomTat: item.tomTat || '',
        noiDung: item.noiDung || '',
        hinhAnh: item.hinhAnh || '',
        slug: item.slug || '',
        loai: item.loai || 'TinTuc',
        dangHoatDong: item.dangHoatDong !== undefined ? item.dangHoatDong : true,
        noiBat: item.noiBat !== undefined ? item.noiBat : false,
        ngayDang: item.ngayDang ? new Date(item.ngayDang).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
      setImagePreview(item.hinhAnh || '');
    } else {
      setEditingTinTuc(null);
      setFormData({
        tieuDe: '',
        tomTat: '',
        noiDung: '',
        hinhAnh: '',
        slug: '',
        loai: 'TinTuc',
        dangHoatDong: true,
        noiBat: false,
        ngayDang: new Date().toISOString().split('T')[0],
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      try {
        const uploadedImage = await adminService.uploadImage(file);
        setFormData({ ...formData, hinhAnh: uploadedImage.url });
      } catch (error) {
        toast.error('Không thể tải ảnh lên');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        ngayDang: formData.ngayDang ? new Date(formData.ngayDang).toISOString() : null,
      };

      if (editingTinTuc) {
        await adminService.capNhatTinTuc(editingTinTuc.id, dataToSend);
        toast.success('Cập nhật tin tức thành công');
      } else {
        await adminService.taoTinTuc(dataToSend);
        toast.success('Tạo tin tức thành công');
      }
      setShowModal(false);
      loadTinTuc();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) return;
    
    try {
      await adminService.xoaTinTuc(id);
      toast.success('Xóa tin tức thành công');
      loadTinTuc();
    } catch (error) {
      toast.error('Không thể xóa tin tức');
    }
  };

  const getLoaiLabel = (loai) => {
    switch (loai) {
      case 'TinTuc':
        return '📰 Tin tức';
      case 'CamNang':
        return '📚 Cẩm nang';
      case 'HuongDan':
        return '📖 Hướng dẫn';
      default:
        return loai;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Tin tức & Cẩm nang
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm Tin tức
        </button>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
            <select
              value={filters.loai}
              onChange={(e) => {
                setFilters({ ...filters, loai: e.target.value });
                setPage(1);
              }}
              className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
            >
              <option value="">Tất cả</option>
              <option value="TinTuc">📰 Tin tức</option>
              <option value="CamNang">📚 Cẩm nang</option>
              <option value="HuongDan">📖 Hướng dẫn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input
              type="text"
              value={filters.timKiem}
              onChange={(e) => {
                setFilters({ ...filters, timKiem: e.target.value });
                setPage(1);
              }}
              placeholder="Tìm theo tiêu đề..."
              className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ loai: '', timKiem: '' });
                setPage(1);
              }}
              className="w-full backdrop-blur-md bg-white/30 text-gray-700 px-4 py-2 rounded-xl hover:bg-white/40 border border-white/50 font-semibold transition-all duration-300"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
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
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
                {tinTuc.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Không có tin tức nào
                    </td>
                  </tr>
                ) : (
                  tinTuc.map((tt) => (
                    <tr key={tt.id} className="hover:bg-white/40 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tt.hinhAnh ? (
                          <img
                            src={tt.hinhAnh.startsWith('http') ? tt.hinhAnh : `http://localhost:5066${tt.hinhAnh}`}
                            alt={tt.tieuDe}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 backdrop-blur-md bg-white/30 rounded-xl flex items-center justify-center text-gray-400 border border-white/50">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {tt.tieuDe}
                        </div>
                        {tt.noiBat && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            ⭐ Nổi bật
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{getLoaiLabel(tt.loai)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tt.soLuotXem || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            tt.dangHoatDong
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tt.dangHoatDong ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tt.ngayDang
                          ? new Date(tt.ngayDang).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(tt)}
                          className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(tt.id)}
                          className="backdrop-blur-md bg-red-500/20 text-red-700 hover:bg-red-500/30 px-4 py-2 rounded-lg border border-red-300/30 transition-all duration-300 font-medium"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/40 transition-all duration-300 font-medium"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg ${
                        page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="px-2">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/40 transition-all duration-300 font-medium"
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
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingTinTuc ? 'Sửa tin tức' : 'Thêm tin tức mới'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tieuDe}
                      onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                      className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                    <select
                      value={formData.loai}
                      onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                      className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                    >
                      <option value="TinTuc">📰 Tin tức</option>
                      <option value="CamNang">📚 Cẩm nang</option>
                      <option value="HuongDan">📖 Hướng dẫn</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                  <textarea
                    value={formData.tomTat}
                    onChange={(e) => setFormData({ ...formData, tomTat: e.target.value })}
                    rows="3"
                    className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                    placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <textarea
                    value={formData.noiDung}
                    onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                    rows="10"
                    className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2 font-mono text-sm"
                    placeholder="Nhập nội dung HTML của bài viết..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bạn có thể sử dụng HTML để định dạng nội dung
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-full object-cover rounded"
                      />
                    )}
                    {formData.hinhAnh && !imagePreview && (
                      <img
                        src={formData.hinhAnh.startsWith('http') ? formData.hinhAnh : `http://localhost:5066${formData.hinhAnh}`}
                        alt="Current"
                        className="mt-2 h-32 w-full object-cover rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                      placeholder="Tự động tạo từ tiêu đề nếu để trống"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đăng</label>
                    <input
                      type="date"
                      value={formData.ngayDang}
                      onChange={(e) => setFormData({ ...formData, ngayDang: e.target.value })}
                      className="w-full border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3 py-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.dangHoatDong}
                        onChange={(e) => setFormData({ ...formData, dangHoatDong: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Đang hoạt động</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.noiBat}
                        onChange={(e) => setFormData({ ...formData, noiBat: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Nổi bật</span>
                    </label>
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
                    {editingTinTuc ? 'Cập nhật' : 'Tạo mới'}
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

export default QuanLyTinTuc;


