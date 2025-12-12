import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { danhMucService } from '../../services/danhMucService';
import { sanPhamService } from '../../services/sanPhamService';
import { toast } from 'react-toastify';

function QuanLySanPham() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'bienThe' ? 'bienThe' : 'sanPham'); // 'sanPham' hoặc 'bienThe'
  const [sanPham, setSanPham] = useState([]);
  const [bienThe, setBienThe] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [thuongHieu, setThuongHieu] = useState([]);
  const [thongKe, setThongKe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBienTheModal, setShowBienTheModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingBienTheId, setEditingBienTheId] = useState(null);
  const [filters, setFilters] = useState({
    timKiem: '',
    danhMucId: '',
    thuongHieuId: '',
    page: 1,
    pageSize: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [bienTheFilters, setBienTheFilters] = useState({
    sanPhamId: '',
    kichThuoc: '',
    mauSac: '',
    timKiem: '',
    page: 1,
    pageSize: 50,
  });
  const [bienTheTotalPages, setBienTheTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    moTaChiTiet: '',
    gia: 0,
    giaGoc: null,
    sku: '',
    danhMucId: '',
    thuongHieuId: '',
    soLuongTon: 0,
    hinhAnhChinh: '',
    danhSachHinhAnh: '',
    video: '',
    slug: '',
    dangHoatDong: true,
    dangKhuyenMai: false,
    sanPhamNoiBat: false,
  });
  const [bienTheFormData, setBienTheFormData] = useState({
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
    if (activeTab === 'sanPham') {
      loadData();
      loadDanhMuc();
      loadThuongHieu();
    } else {
      loadBienThe();
      loadSanPhamForBienThe();
      loadThongKe();
    }
  }, [filters, bienTheFilters, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachSanPham(
        filters.timKiem || undefined,
        filters.danhMucId || undefined,
        filters.thuongHieuId || undefined,
        filters.page,
        filters.pageSize
      );
      setSanPham(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadDanhMuc = async () => {
    try {
      const data = await danhMucService.getDanhSach();
      setDanhMuc(data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const loadThuongHieu = async () => {
    try {
      const data = await adminService.getDanhSachThuongHieu();
      setThuongHieu(data);
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
    }
  };

  const loadBienThe = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachKho(
        bienTheFilters.sanPhamId || undefined,
        bienTheFilters.kichThuoc || undefined,
        bienTheFilters.mauSac || undefined,
        bienTheFilters.timKiem || undefined,
        bienTheFilters.page,
        bienTheFilters.pageSize
      );
      setBienThe(response.data);
      setBienTheTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách biến thể');
    } finally {
      setLoading(false);
    }
  };

  const loadSanPhamForBienThe = async () => {
    try {
      const data = await sanPhamService.getDanhSach({ pageSize: 1000 });
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

  const handleOpenModal = async (id = null) => {
    if (id) {
      try {
        const data = await adminService.getSanPhamById(id);
        setFormData({
          ten: data.ten || '',
          moTa: data.moTa || '',
          moTaChiTiet: data.moTaChiTiet || '',
          gia: data.gia || 0,
          giaGoc: data.giaGoc || null,
          sku: data.sku || '',
          danhMucId: data.danhMucId || '',
          thuongHieuId: data.thuongHieuId || null,
          soLuongTon: data.soLuongTon || 0,
          hinhAnhChinh: data.hinhAnhChinh || '',
          danhSachHinhAnh: data.danhSachHinhAnh || '',
          video: data.video || '',
          slug: data.slug || '',
          dangHoatDong: data.dangHoatDong ?? true,
          dangKhuyenMai: data.dangKhuyenMai ?? false,
          sanPhamNoiBat: data.sanPhamNoiBat ?? false,
        });
        setEditingId(id);
      } catch (error) {
        toast.error('Không thể tải thông tin sản phẩm');
        return;
      }
    } else {
      setFormData({
        ten: '',
        moTa: '',
        moTaChiTiet: '',
        gia: 0,
        giaGoc: null,
        sku: '',
        danhMucId: '',
        thuongHieuId: '',
        soLuongTon: 0,
        hinhAnhChinh: '',
        danhSachHinhAnh: '',
        video: '',
        slug: '',
        dangHoatDong: true,
        dangKhuyenMai: false,
        sanPhamNoiBat: false,
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
        danhMucId: parseInt(formData.danhMucId),
        thuongHieuId: formData.thuongHieuId ? parseInt(formData.thuongHieuId) : null,
        gia: parseFloat(formData.gia),
        giaGoc: formData.giaGoc ? parseFloat(formData.giaGoc) : null,
        soLuongTon: parseInt(formData.soLuongTon),
      };

      if (editingId) {
        await adminService.capNhatSanPham(editingId, dataToSend);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await adminService.taoSanPham(dataToSend);
        toast.success('Tạo sản phẩm thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    try {
      await adminService.xoaSanPham(id);
      toast.success('Xóa sản phẩm thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleBienTheFilterChange = (e) => {
    setBienTheFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  const handleOpenBienTheModal = (item = null) => {
    if (item) {
      setBienTheFormData({
        sanPhamId: item.sanPhamId.toString(),
        kichThuoc: item.kichThuoc || '',
        mauSac: item.mauSac || '',
        sku: item.sku || '',
        soLuongTon: item.soLuongTon || 0,
        gia: item.gia || null,
        hinhAnh: item.hinhAnh || '',
        dangHoatDong: item.dangHoatDong ?? true,
      });
      setEditingBienTheId(item.id);
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
      setBienTheFormData({
        sanPhamId: bienTheFilters.sanPhamId || '',
        kichThuoc: '',
        mauSac: '',
        sku: '',
        soLuongTon: 0,
        gia: null,
        hinhAnh: '',
        dangHoatDong: true,
      });
      setEditingBienTheId(null);
      setImagePreview(null);
    }
    setImageFile(null);
    setShowBienTheModal(true);
  };

  const handleBienTheImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBienTheSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = bienTheFormData.hinhAnh;

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
        ...bienTheFormData,
        sanPhamId: parseInt(bienTheFormData.sanPhamId),
        soLuongTon: parseInt(bienTheFormData.soLuongTon),
        gia: bienTheFormData.gia ? parseFloat(bienTheFormData.gia) : null,
        hinhAnh: imageUrl,
      };

      if (editingBienTheId) {
        await adminService.capNhatBienThe(editingBienTheId, dataToSend);
        toast.success('Cập nhật biến thể thành công!');
      } else {
        await adminService.taoBienThe(dataToSend);
        toast.success('Tạo biến thể thành công!');
      }
      setShowBienTheModal(false);
      setImageFile(null);
      setImagePreview(null);
      loadBienThe();
      loadThongKe();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      setUploadingImage(false);
    }
  };

  const handleDeleteBienThe = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa biến thể này?')) {
      return;
    }
    try {
      await adminService.xoaBienThe(id);
      toast.success('Xóa biến thể thành công!');
      loadBienThe();
      loadThongKe();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa biến thể');
    }
  };

  const handleCapNhatSoLuongBienThe = async (id, soLuongMoi) => {
    try {
      await adminService.capNhatSoLuongKho(id, parseInt(soLuongMoi));
      toast.success('Cập nhật số lượng thành công!');
      loadBienThe();
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
          Quản lý sản phẩm & Biến thể
        </h1>
        <button
          onClick={() => activeTab === 'sanPham' ? handleOpenModal() : handleOpenBienTheModal()}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300 hover:scale-105"
        >
          + {activeTab === 'sanPham' ? 'Thêm sản phẩm' : 'Thêm biến thể'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-white/30">
          <button
            onClick={() => {
              setActiveTab('sanPham');
              setSearchParams({});
            }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'sanPham'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sản phẩm
          </button>
          <button
            onClick={() => {
              setActiveTab('bienThe');
              setSearchParams({ tab: 'bienThe' });
            }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'bienThe'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Biến thể
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sanPham' ? (
        <>
          {/* Filters */}
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="timKiem"
                placeholder="Tìm kiếm..."
                value={filters.timKiem}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                name="danhMucId"
                value={filters.danhMucId}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả danh mục</option>
                {danhMuc.map(dm => (
                  <option key={dm.id} value={dm.id}>{dm.ten}</option>
                ))}
              </select>
              <select
                name="thuongHieuId"
                value={filters.thuongHieuId}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả thương hiệu</option>
                {thuongHieu.map(th => (
                  <option key={th.id} value={th.id}>{th.ten}</option>
                ))}
              </select>
              <button
                onClick={() => setFilters(prev => ({ ...prev, timKiem: '', danhMucId: '', thuongHieuId: '', page: 1 }))}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20 divide-y divide-white/30">
            {sanPham.map((sp) => (
              <tr key={sp.id} className="hover:bg-white/40 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={sp.hinhAnhChinh 
                      ? (sp.hinhAnhChinh.startsWith('http') 
                          ? sp.hinhAnhChinh 
                          : sp.hinhAnhChinh.startsWith('/')
                          ? `http://localhost:5066${sp.hinhAnhChinh}`
                          : `http://localhost:5066/uploads/${sp.hinhAnhChinh}`)
                      : '/placeholder.jpg'} 
                    alt={sp.ten} 
                    className="w-16 h-16 object-cover rounded" 
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{sp.ten}</div>
                  {sp.sanPhamNoiBat && <span className="text-xs text-blue-600">⭐ Nổi bật</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(sp.gia)}
                  {sp.giaGoc && <div className="text-xs text-gray-400 line-through">{formatPrice(sp.giaGoc)}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sp.soLuongTon}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sp.danhMuc?.ten}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${sp.dangHoatDong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sp.dangHoatDong ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(sp.id)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(sp.id)}
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
        </>
      ) : (
        <>
          {/* Thống kê biến thể */}
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

          {/* Filters biến thể */}
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                name="timKiem"
                placeholder="Tìm kiếm tên sản phẩm, SKU..."
                value={bienTheFilters.timKiem}
                onChange={handleBienTheFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                name="sanPhamId"
                value={bienTheFilters.sanPhamId}
                onChange={handleBienTheFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả sản phẩm</option>
                {Array.isArray(sanPham) && sanPham.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.ten}</option>
                ))}
              </select>
              <select
                name="kichThuoc"
                value={bienTheFilters.kichThuoc}
                onChange={handleBienTheFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả size</option>
                {thongKe?.danhSachSize?.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <select
                name="mauSac"
                value={bienTheFilters.mauSac}
                onChange={handleBienTheFilterChange}
                className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả màu</option>
                {thongKe?.danhSachMauSac?.map(mau => (
                  <option key={mau} value={mau}>{mau}</option>
                ))}
              </select>
              <button
                onClick={() => setBienTheFilters(prev => ({ ...prev, timKiem: '', sanPhamId: '', kichThuoc: '', mauSac: '', page: 1 }))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Table biến thể */}
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
                {bienThe.map((item) => (
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
                          handleCapNhatSoLuongBienThe(item.id, newValue);
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
                        onClick={() => handleOpenBienTheModal(item)}
                        className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-4 py-2 rounded-lg mr-4 border border-blue-300/30 transition-all duration-300 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteBienThe(item.id)}
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

          {/* Pagination biến thể */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => setBienTheFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={bienTheFilters.page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-gray-700">
              Trang {bienTheFilters.page} / {bienTheTotalPages}
            </span>
            <button
              onClick={() => setBienTheFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={bienTheFilters.page === bienTheTotalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.ten}
                    onChange={(e) => setFormData(prev => ({ ...prev, ten: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
                <textarea
                  value={formData.moTaChiTiet}
                  onChange={(e) => setFormData(prev => ({ ...prev, moTaChiTiet: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="5"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.gia}
                    onChange={(e) => setFormData(prev => ({ ...prev, gia: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá gốc</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.giaGoc || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, giaGoc: e.target.value || null }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soLuongTon}
                    onChange={(e) => setFormData(prev => ({ ...prev, soLuongTon: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select
                    required
                    value={formData.danhMucId}
                    onChange={(e) => setFormData(prev => ({ ...prev, danhMucId: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    {danhMuc.map(dm => (
                      <option key={dm.id} value={dm.id}>{dm.ten}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thương hiệu</label>
                  <select
                    value={formData.thuongHieuId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, thuongHieuId: e.target.value || null }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Không có</option>
                    {thuongHieu.map(th => (
                      <option key={th.id} value={th.id}>{th.ten}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh chính</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const result = await adminService.uploadImage(file);
                          setFormData(prev => ({ ...prev, hinhAnhChinh: result.url }));
                          toast.success('Upload ảnh thành công!');
                        } catch (error) {
                          toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh');
                        }
                      }
                    }}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Hoặc nhập URL ảnh"
                    value={formData.hinhAnhChinh}
                    onChange={(e) => setFormData(prev => ({ ...prev, hinhAnhChinh: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {formData.hinhAnhChinh && (
                    <div className="mt-2">
                      <img
                        src={formData.hinhAnhChinh.startsWith('http') 
                          ? formData.hinhAnhChinh 
                          : formData.hinhAnhChinh.startsWith('/')
                          ? `http://localhost:5066${formData.hinhAnhChinh}`
                          : `http://localhost:5066/uploads/${formData.hinhAnhChinh}`}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dangHoatDong}
                    onChange={(e) => setFormData(prev => ({ ...prev, dangHoatDong: e.target.checked }))}
                    className="mr-2"
                  />
                  Đang hoạt động
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dangKhuyenMai}
                    onChange={(e) => setFormData(prev => ({ ...prev, dangKhuyenMai: e.target.checked }))}
                    className="mr-2"
                  />
                  Đang khuyến mãi
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sanPhamNoiBat}
                    onChange={(e) => setFormData(prev => ({ ...prev, sanPhamNoiBat: e.target.checked }))}
                    className="mr-2"
                  />
                  Sản phẩm nổi bật
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
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl border border-white/30 transition-all duration-300 font-semibold"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Biến thể */}
      {showBienTheModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingBienTheId ? 'Sửa biến thể' : 'Thêm biến thể mới'}</h2>
            <form onSubmit={handleBienTheSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sản phẩm *</label>
                <select
                  required
                  value={bienTheFormData.sanPhamId}
                  onChange={(e) => setBienTheFormData(prev => ({ ...prev, sanPhamId: e.target.value }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={!!editingBienTheId}
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
                    value={bienTheFormData.kichThuoc}
                    onChange={(e) => setBienTheFormData(prev => ({ ...prev, kichThuoc: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="VD: 40, M, L..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <input
                    type="text"
                    value={bienTheFormData.mauSac}
                    onChange={(e) => setBienTheFormData(prev => ({ ...prev, mauSac: e.target.value }))}
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
                    value={bienTheFormData.sku}
                    onChange={(e) => setBienTheFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bienTheFormData.soLuongTon}
                    onChange={(e) => setBienTheFormData(prev => ({ ...prev, soLuongTon: e.target.value }))}
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
                  value={bienTheFormData.gia || ''}
                  onChange={(e) => setBienTheFormData(prev => ({ ...prev, gia: e.target.value || null }))}
                  className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Để trống nếu dùng giá sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                <div className="space-y-2">
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
                          setBienTheFormData(prev => ({ ...prev, hinhAnh: '' }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBienTheImageChange}
                      className="w-full px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={uploadingImage}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Chọn ảnh từ máy tính (JPG, PNG, tối đa 5MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hoặc nhập URL ảnh:</label>
                    <input
                      type="text"
                      value={bienTheFormData.hinhAnh}
                      onChange={(e) => {
                        setBienTheFormData(prev => ({ ...prev, hinhAnh: e.target.value }));
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
                    checked={bienTheFormData.dangHoatDong}
                    onChange={(e) => setBienTheFormData(prev => ({ ...prev, dangHoatDong: e.target.checked }))}
                    className="mr-2"
                  />
                  Đang hoạt động
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBienTheModal(false);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 border border-white/50 rounded-xl hover:bg-white/30 backdrop-blur-md transition-all duration-300 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl border border-white/30 transition-all duration-300 font-semibold disabled:opacity-50"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Đang upload...' : (editingBienTheId ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLySanPham;

