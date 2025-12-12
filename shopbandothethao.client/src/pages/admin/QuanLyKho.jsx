import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { sanPhamService } from '../../services/sanPhamService';
import { toast } from 'react-toastify';

function QuanLyKho() {
  const [kho, setKho] = useState([]);
  const [sanPham, setSanPham] = useState([]); // Đảm bảo luôn là array
  const [thongKe, setThongKe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    sanPhamId: '',
    kichThuoc: '',
    mauSac: '',
    timKiem: '',
    page: 1,
    pageSize: 50,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    sanPhamId: '',
    kichThuoc: '',
    mauSac: '',
    sku: '',
    soLuongTon: 0,
    gia: null,
    hinhAnh: '',
    dangHoatDong: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
    loadSanPham();
    loadThongKe();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachKho(
        filters.sanPhamId || undefined,
        filters.kichThuoc || undefined,
        filters.mauSac || undefined,
        filters.timKiem || undefined,
        filters.page,
        filters.pageSize
      );
      setKho(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách kho');
    } finally {
      setLoading(false);
    }
  };

  const loadSanPham = async () => {
    try {
      const data = await sanPhamService.getDanhSach({ pageSize: 1000 }); // Lấy tất cả sản phẩm
      // API trả về object có property Data (hoặc data)
      if (Array.isArray(data)) {
        setSanPham(data);
      } else if (data && Array.isArray(data.data)) {
        setSanPham(data.data);
      } else if (data && Array.isArray(data.Data)) {
        setSanPham(data.Data);
      } else {
        setSanPham([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setSanPham([]);
    }
  };

  const loadThongKe = async () => {
    try {
      const data = await adminService.getThongKeKho();
      setThongKe(data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        sanPhamId: item.sanPhamId.toString(),
        kichThuoc: item.kichThuoc || '',
        mauSac: item.mauSac || '',
        sku: item.sku || '',
        soLuongTon: item.soLuongTon || 0,
        gia: item.gia || null,
        hinhAnh: item.hinhAnh || '',
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingId(item.id);
      // Set preview cho ảnh hiện tại
      if (item.hinhAnh) {
        const imageUrl = item.hinhAnh.startsWith('http') 
          ? item.hinhAnh 
          : item.hinhAnh.startsWith('/')
          ? `http://localhost:5066${item.hinhAnh}`
          : `http://localhost:5066/uploads/${item.hinhAnh}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        sanPhamId: filters.sanPhamId || '',
        kichThuoc: '',
        mauSac: '',
        sku: '',
        soLuongTon: 0,
        gia: null,
        hinhAnh: '',
        dangHoatDong: true,
      });
      setEditingId(null);
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.hinhAnh;

      // Upload ảnh nếu có file mới
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await adminService.uploadImage(imageFile);
          imageUrl = uploadResult.url || uploadResult.fileName;
        } catch (uploadError) {
          toast.error('Lỗi khi upload ảnh');
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const dataToSend = {
        ...formData,
        sanPhamId: parseInt(formData.sanPhamId),
        soLuongTon: parseInt(formData.soLuongTon),
        gia: formData.gia ? parseFloat(formData.gia) : null,
        hinhAnh: imageUrl,
      };

      if (editingId) {
        await adminService.capNhatBienThe(editingId, dataToSend);
        toast.success('Cập nhật biến thể thành công!');
      } else {
        await adminService.taoBienThe(dataToSend);
        toast.success('Tạo biến thể thành công!');
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
      loadData();
      loadThongKe();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa biến thể này?')) {
      return;
    }
    try {
      await adminService.xoaBienThe(id);
      toast.success('Xóa biến thể thành công!');
      loadData();
      loadThongKe();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa biến thể');
    }
  };

  const handleCapNhatSoLuong = async (id, soLuongMoi) => {
    try {
      await adminService.capNhatSoLuongKho(id, parseInt(soLuongMoi));
      toast.success('Cập nhật số lượng thành công!');
      loadData();
      loadThongKe();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý kho
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + Thêm biến thể
        </button>
      </div>

      {/* Thống kê */}
      {thongKe && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng số lượng</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{thongKe.tongSoLuong.toLocaleString('vi-VN')}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Số biến thể</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{thongKe.soBienThe}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Hết hàng</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">{thongKe.soBienTheHetHang}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Sắp hết hàng</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{thongKe.soBienTheSapHetHang}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="timKiem"
            placeholder="Tìm kiếm tên sản phẩm, SKU..."
            value={filters.timKiem}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            name="sanPhamId"
            value={filters.sanPhamId}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tất cả sản phẩm</option>
            {Array.isArray(sanPham) && sanPham.map(sp => (
              <option key={sp.id} value={sp.id}>{sp.ten}</option>
            ))}
          </select>
          <select
            name="kichThuoc"
            value={filters.kichThuoc}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tất cả size</option>
            {thongKe?.danhSachSize?.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <select
            name="mauSac"
            value={filters.mauSac}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tất cả màu</option>
            {thongKe?.danhSachMauSac?.map(mau => (
              <option key={mau} value={mau}>{mau}</option>
            ))}
          </select>
          <button
            onClick={() => setFilters(prev => ({ ...prev, timKiem: '', sanPhamId: '', kichThuoc: '', mauSac: '', page: 1 }))}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Màu sắc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng tồn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {kho.map((item) => (
              <tr key={item.id} className={`hover:bg-white/40 transition-all duration-300 ${item.soLuongTon === 0 ? 'bg-red-500/20' : item.soLuongTon <= 10 ? 'bg-yellow-500/20' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.sanPham?.hinhAnhChinh 
                        ? (item.sanPham.hinhAnhChinh.startsWith('http') 
                            ? item.sanPham.hinhAnhChinh 
                            : item.sanPham.hinhAnhChinh.startsWith('/')
                            ? `http://localhost:5066${item.sanPham.hinhAnhChinh}`
                            : `http://localhost:5066/uploads/${item.sanPham.hinhAnhChinh}`)
                        : '/placeholder.jpg'}
                      alt={item.sanPham?.ten}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.sanPham?.ten}</div>
                      <div className="text-xs text-gray-500">{item.sanPham?.danhMuc?.ten}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kichThuoc || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mauSac || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    value={item.soLuongTon}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      handleCapNhatSoLuong(item.id, newValue);
                    }}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.gia ? formatPrice(item.gia) : formatPrice(item.sanPham?.gia || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.dangHoatDong 
                      ? (item.soLuongTon === 0 ? 'bg-red-100 text-red-800' : item.soLuongTon <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.dangHoatDong 
                      ? (item.soLuongTon === 0 ? 'Hết hàng' : item.soLuongTon <= 10 ? 'Sắp hết' : 'Còn hàng')
                      : 'Tạm khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa biến thể' : 'Thêm biến thể mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sản phẩm *</label>
                <select
                  required
                  value={formData.sanPhamId}
                  onChange={(e) => setFormData(prev => ({ ...prev, sanPhamId: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={!!editingId}
                >
                  <option value="">Chọn sản phẩm</option>
                  {Array.isArray(sanPham) && sanPham.map(sp => (
                    <option key={sp.id} value={sp.id}>{sp.ten}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kích thước</label>
                  <input
                    type="text"
                    value={formData.kichThuoc}
                    onChange={(e) => setFormData(prev => ({ ...prev, kichThuoc: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="VD: 40, M, L..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <input
                    type="text"
                    value={formData.mauSac}
                    onChange={(e) => setFormData(prev => ({ ...prev, mauSac: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="VD: Đen, Trắng..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Có thể để trống"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.soLuongTon}
                    onChange={(e) => setFormData(prev => ({ ...prev, soLuongTon: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá (nếu khác giá sản phẩm)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.gia || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, gia: e.target.value || null }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Để trống nếu dùng giá sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                <div className="space-y-2">
                  {/* Preview ảnh */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, hinhAnh: '' }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {/* File input */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={uploadingImage}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Chọn ảnh từ máy tính (JPG, PNG, tối đa 5MB)
                    </p>
                  </div>

                  {/* Hoặc nhập URL */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hoặc nhập URL ảnh:</label>
                    <input
                      type="text"
                      value={formData.hinhAnh}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, hinhAnh: e.target.value }));
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                        } else if (!imageFile) {
                          setImagePreview(null);
                        }
                      }}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="https://..."
                      disabled={!!imageFile}
                    />
                  </div>
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
                  className="px-4 py-2 border border-white/50 rounded-xl hover:bg-white/30 backdrop-blur-md transition-all duration-300 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl border border-white/30 transition-all duration-300 font-semibold disabled:opacity-50"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Đang upload...' : (editingId ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyKho;

