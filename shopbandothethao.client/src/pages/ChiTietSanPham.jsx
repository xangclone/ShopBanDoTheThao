import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { gioHangService } from '../services/gioHangService';
import { authService } from '../services/authService';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import { 
  HiOutlineShoppingCart, 
  HiOutlineHeart, 
  HiOutlineMinus, 
  HiOutlinePlus, 
  HiOutlineDocumentText, 
  HiOutlineSparkles,
  HiOutlineChat,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineX,
  HiOutlineShoppingBag
} from 'react-icons/hi';

function ChiTietSanPham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sanPham, setSanPham] = useState(null);
  const [sanPhamTuongTu, setSanPhamTuongTu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soLuong, setSoLuong] = useState(1);
  const [kichThuoc, setKichThuoc] = useState('');
  const [mauSac, setMauSac] = useState('');
  const [bienTheId, setBienTheId] = useState(null);
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState(null);
  const [danhSachHinhAnh, setDanhSachHinhAnh] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadSanPham();
    loadSanPhamTuongTu();
  }, [id]);

  const loadSanPham = async () => {
    try {
      const data = await sanPhamService.getById(id);
      setSanPham(data);
      
      // Tạo danh sách hình ảnh từ sản phẩm và biến thể
      const images = [];
      
      // Thêm hình ảnh chính
      if (data.hinhAnhChinh) {
        images.push(data.hinhAnhChinh);
      }
      
      // Thêm hình ảnh từ danh sách hình ảnh (nếu có)
      if (data.danhSachHinhAnh) {
        try {
          const imageList = typeof data.danhSachHinhAnh === 'string' 
            ? JSON.parse(data.danhSachHinhAnh) 
            : data.danhSachHinhAnh;
          if (Array.isArray(imageList)) {
            images.push(...imageList.filter(img => img && img !== data.hinhAnhChinh));
          }
        } catch (e) {
          // Nếu không parse được, bỏ qua
        }
      }
      
      // Thêm hình ảnh từ các biến thể (nếu có và chưa có trong danh sách)
      if (data.danhSachBienThe && data.danhSachBienThe.length > 0) {
        data.danhSachBienThe.forEach(variant => {
          if (variant.hinhAnh && !images.includes(variant.hinhAnh)) {
            images.push(variant.hinhAnh);
          }
        });
      }
      
      setDanhSachHinhAnh(images);
      
      // Tự động chọn biến thể đầu tiên nếu có
      if (data.danhSachBienThe && data.danhSachBienThe.length > 0) {
        const firstVariant = data.danhSachBienThe[0];
        setKichThuoc(firstVariant.kichThuoc || '');
        setMauSac(firstVariant.mauSac || '');
        setBienTheId(firstVariant.id);
        // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
        setHinhAnhHienTai(firstVariant.hinhAnh || data.hinhAnhChinh);
      } else {
        setHinhAnhHienTai(data.hinhAnhChinh);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadSanPhamTuongTu = async () => {
    try {
      const data = await sanPhamService.getTuongTu(id, 8);
      setSanPhamTuongTu(data || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm tương tự:', error);
      // Không hiển thị lỗi vì đây là tính năng phụ
    }
  };

  // Lấy danh sách size và màu sắc duy nhất từ biến thể
  const getAvailableSizes = () => {
    if (!sanPham?.danhSachBienThe) return [];
    const sizes = [...new Set(sanPham.danhSachBienThe.map(v => v.kichThuoc).filter(Boolean))];
    return sizes.sort();
  };

  const getAvailableColors = () => {
    if (!sanPham?.danhSachBienThe) return [];
    // Lọc màu sắc theo size đã chọn
    const variants = kichThuoc 
      ? sanPham.danhSachBienThe.filter(v => v.kichThuoc === kichThuoc)
      : sanPham.danhSachBienThe;
    const colors = [...new Set(variants.map(v => v.mauSac).filter(Boolean))];
    return colors.sort();
  };

  // Lấy số lượng tồn kho của biến thể hiện tại
  const getAvailableQuantity = () => {
    if (!sanPham?.danhSachBienThe) return sanPham?.soLuongTon || 0;
    
    const variant = sanPham.danhSachBienThe.find(v => 
      v.kichThuoc === kichThuoc && v.mauSac === mauSac
    );
    
    return variant ? variant.soLuongTon : (sanPham?.soLuongTon || 0);
  };

  // Map màu sắc từ text sang màu hex
  const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';
    
    const colorMap = {
      'Đỏ': '#EF4444',
      'Xanh dương': '#3B82F6',
      'Xanh lá': '#10B981',
      'Vàng': '#F59E0B',
      'Đen': '#1F2937',
      'Trắng': '#FFFFFF',
      'Xám': '#6B7280',
      'Hồng': '#EC4899',
      'Tím': '#8B5CF6',
      'Cam': '#F97316',
      'Nâu': '#92400E',
      'Xanh ngọc': '#06B6D4',
      'Đỏ': '#DC2626',
      'Xanh': '#2563EB',
      'Vàng': '#FBBF24',
      'Hồng': '#F472B6',
      'Tím': '#A855F7',
      'Cam': '#FB923C',
      'Nâu': '#A16207',
      'Xám': '#9CA3AF',
      'Be': '#F5F5DC',
      'Kem': '#FFFDD0',
      'Xanh navy': '#1E3A8A',
      'Xanh rêu': '#059669',
      'Vàng gold': '#D4AF37',
    };
    
    // Tìm màu không phân biệt hoa thường
    const normalizedColor = colorName.toLowerCase().trim();
    for (const [key, value] of Object.entries(colorMap)) {
      if (key.toLowerCase() === normalizedColor) {
        return value;
      }
    }
    
    // Nếu không tìm thấy, trả về màu mặc định dựa trên tên
    return '#CCCCCC';
  };

  // Xử lý khi chọn size
  const handleSizeChange = (size) => {
    setKichThuoc(size);
    setMauSac(''); // Reset màu sắc khi đổi size
    
    // Tìm biến thể tương ứng
    if (sanPham?.danhSachBienThe) {
      const variant = sanPham.danhSachBienThe.find(v => v.kichThuoc === size);
      if (variant) {
        setBienTheId(variant.id);
        // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
        setHinhAnhHienTai(variant.hinhAnh || sanPham.hinhAnhChinh);
        // Tự động chọn màu đầu tiên nếu có
        if (variant.mauSac) {
          setMauSac(variant.mauSac);
        }
      }
    }
  };

  // Xử lý khi chọn màu sắc
  const handleColorChange = (color) => {
    setMauSac(color);
    
    // Tìm biến thể tương ứng
    if (sanPham?.danhSachBienThe) {
      const variant = sanPham.danhSachBienThe.find(v => 
        (v.kichThuoc === kichThuoc || !kichThuoc) && v.mauSac === color
      );
      if (variant) {
        setBienTheId(variant.id);
        // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
        if (variant.hinhAnh) {
          setHinhAnhHienTai(variant.hinhAnh);
        } else {
          setHinhAnhHienTai(sanPham.hinhAnhChinh);
        }
      }
    }
  };

  // Cập nhật hình ảnh khi kichThuoc hoặc mauSac thay đổi
  useEffect(() => {
    if (!sanPham) return;
    
    if (sanPham.danhSachBienThe && sanPham.danhSachBienThe.length > 0 && (kichThuoc || mauSac)) {
      // Tìm biến thể khớp với size và màu đã chọn
      const variant = sanPham.danhSachBienThe.find(v => {
        const matchSize = !kichThuoc || v.kichThuoc === kichThuoc;
        const matchColor = !mauSac || v.mauSac === mauSac;
        return matchSize && matchColor;
      });
      
      if (variant && variant.hinhAnh) {
        setHinhAnhHienTai(variant.hinhAnh);
      } else {
        setHinhAnhHienTai(sanPham.hinhAnhChinh);
      }
    } else {
      setHinhAnhHienTai(sanPham.hinhAnhChinh);
    }
  }, [kichThuoc, mauSac, sanPham?.id]);

  const handleThemVaoGioHang = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    const availableQty = getAvailableQuantity();
    if (soLuong > availableQty) {
      toast.error(`Chỉ còn ${availableQty} sản phẩm trong kho`);
      setSoLuong(Math.max(1, availableQty));
      return;
    }

    try {
      await gioHangService.themVaoGioHang({
        sanPhamId: parseInt(id),
        soLuong,
        kichThuoc: kichThuoc || null,
        mauSac: mauSac || null,
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleThemVaoYeuThich = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    try {
      // TODO: Implement wishlist API
      // await wishlistService.themVaoYeuThich(parseInt(id));
      toast.success('Đã thêm vào yêu thích!');
    } catch (error) {
      toast.error('Không thể thêm vào yêu thích');
    }
  };

  const handleMuaNgay = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      navigate('/dang-nhap');
      return;
    }

    const availableQty = getAvailableQuantity();
    if (soLuong > availableQty) {
      toast.error(`Chỉ còn ${availableQty} sản phẩm trong kho`);
      setSoLuong(Math.max(1, availableQty));
      return;
    }

    try {
      // Thêm vào giỏ hàng
      await gioHangService.themVaoGioHang({
        sanPhamId: parseInt(id),
        soLuong,
        kichThuoc: kichThuoc || null,
        mauSac: mauSac || null,
      });
      
      // Chuyển đến trang thanh toán
      navigate('/thanh-toan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const [showTuVanModal, setShowTuVanModal] = useState(false);
  const [tuVanForm, setTuVanForm] = useState({
    ten: '',
    soDienThoai: '',
    email: '',
    cauHoi: ''
  });

  const handleTuVan = () => {
    // Mở chatbot và gửi sản phẩm kèm câu hỏi
    const event = new CustomEvent('openChatbot', { 
      detail: { 
        product: sanPham,
        question: `Tôi muốn tư vấn về sản phẩm "${sanPham.ten}"`
      } 
    });
    window.dispatchEvent(event);
    
    // Hiển thị modal tư vấn (tùy chọn)
    // setShowTuVanModal(true);
  };

  const handleSubmitTuVan = async (e) => {
    e.preventDefault();
    
    if (!tuVanForm.ten || !tuVanForm.soDienThoai || !tuVanForm.cauHoi) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // TODO: Gửi yêu cầu tư vấn đến backend
    toast.success('Yêu cầu tư vấn đã được gửi! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    setShowTuVanModal(false);
    setTuVanForm({ ten: '', soDienThoai: '', email: '', cauHoi: '' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (!sanPham) {
    return <div className="container mx-auto px-4 py-8 text-center">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            {/* Ảnh chính */}
            <div className="relative bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6 overflow-hidden cursor-pointer group" onClick={() => setShowImageModal(true)}>
              <ImageWithFallback
                src={hinhAnhHienTai || sanPham.hinhAnhChinh}
                alt={sanPham.ten}
                className="w-full h-[500px] object-contain rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 transition-all duration-500 group-hover:scale-105"
              />
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Danh sách ảnh nhỏ */}
            {danhSachHinhAnh.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {danhSachHinhAnh.map((img, index) => {
                  const isActive = (hinhAnhHienTai || sanPham.hinhAnhChinh) === img;
                  return (
                    <button
                      key={index}
                      onClick={() => setHinhAnhHienTai(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                        isActive
                          ? 'border-pink-500 ring-2 ring-pink-300 ring-offset-2 scale-105'
                          : 'border-pink-200 hover:border-pink-400'
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${sanPham.ten} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {sanPham.ten}
            </h1>
            <div className="mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(sanPham.gia)}
              </span>
              {sanPham.giaGoc && (
                <span className="ml-4 text-xl text-gray-400 line-through font-medium">
                  {formatPrice(sanPham.giaGoc)}
                </span>
              )}
            </div>
            {sanPham.moTa && (
              <p className="mb-6 text-gray-700 text-lg leading-relaxed">{sanPham.moTa}</p>
            )}
            
            {/* Chọn Size */}
            {getAvailableSizes().length > 0 && (
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-3 font-bold text-gray-700 text-lg">
                  <HiOutlineDocumentText className="w-6 h-6 text-pink-600" />
                  <span>Kích thước</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`px-6 py-3 border-2 rounded-2xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                        kichThuoc === size
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500 shadow-xl scale-105'
                          : 'bg-white/80 backdrop-blur-sm border-pink-200 text-gray-700 hover:border-pink-400 hover:bg-pink-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chọn Màu sắc */}
            {getAvailableColors().length > 0 && (
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-3 font-bold text-gray-700 text-lg">
                  <HiOutlineSparkles className="w-6 h-6 text-pink-600" />
                  <span>Màu sắc</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {getAvailableColors().map((color) => {
                    const colorHex = getColorHex(color);
                    const isSelected = mauSac === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`relative group flex items-center gap-2 px-4 py-3 border-2 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                          isSelected
                            ? 'border-pink-500 shadow-xl scale-105 bg-white/90'
                            : 'bg-white/80 backdrop-blur-sm border-pink-200 hover:border-pink-400 hover:bg-pink-50'
                        }`}
                        title={color}
                      >
                        {/* Color Swatch */}
                        <div
                          className="w-8 h-8 rounded-full border-2 shadow-md transition-all duration-300"
                          style={{
                            backgroundColor: colorHex,
                            borderColor: isSelected ? '#EC4899' : '#FCE7F3',
                            boxShadow: isSelected ? '0 0 0 3px rgba(236, 72, 153, 0.3)' : 'none',
                          }}
                        />
                        {/* Color Name */}
                        <span className={isSelected ? 'text-pink-600 font-bold' : 'text-gray-700'}>
                          {color}
                        </span>
                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Số lượng tồn kho */}
          <div className="mb-6 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
            <p className="text-gray-700 font-semibold">
              Số lượng còn lại: <span className="text-emerald-600 font-bold text-lg">{getAvailableQuantity()}</span>
            </p>
          </div>

          {/* Số lượng */}
          <div className="mb-6">
            <label className="flex items-center gap-2 mb-3 font-bold text-gray-700 text-lg">
              <HiOutlineDocumentText className="w-6 h-6 text-pink-600" />
              <span>Số lượng</span>
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setSoLuong(Math.max(1, soLuong - 1))}
                className="w-12 h-12 border-2 border-pink-200 rounded-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={soLuong <= 1}
              >
                <HiOutlineMinus className="w-5 h-5" />
              </button>
              <span className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-2xl font-bold text-xl text-gray-800 shadow-md">
                {soLuong}
              </span>
              <button
                type="button"
                onClick={() => {
                  const maxQty = getAvailableQuantity();
                  setSoLuong(Math.min(maxQty, soLuong + 1));
                }}
                className="w-12 h-12 border-2 border-pink-200 rounded-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={soLuong >= getAvailableQuantity()}
              >
                <HiOutlinePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Ô Mua ngay và Tư vấn */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Ô Mua ngay */}
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-300 rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105" onClick={handleMuaNgay}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 group-hover:scale-110 transition-transform shadow-lg">
                  <HiOutlineShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">Mua ngay</h3>
                  <p className="text-sm text-gray-600 font-medium">Thanh toán nhanh</p>
                </div>
              </div>
            </div>

            {/* Ô Tư vấn */}
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105" onClick={handleTuVan}>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 group-hover:scale-110 transition-transform shadow-lg">
                  <HiOutlineChat className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">Tư vấn</h3>
                  <p className="text-sm text-gray-600 font-medium">Hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động phụ */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleThemVaoGioHang}
              className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleThemVaoYeuThich}
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-pink-400 text-pink-600 rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <HiOutlineHeart className="w-5 h-5" />
              Yêu thích
            </button>
          </div>
        </div>
      </div>
      </div>
      {sanPham.moTaChiTiet && (
        <div className="mt-12 container mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
            <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <HiOutlineDocumentText className="w-8 h-8 text-pink-600" />
              <span>Chi tiết sản phẩm</span>
            </h2>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: sanPham.moTaChiTiet }} />
          </div>
        </div>
      )}

      {/* Sản phẩm tương tự */}
      {sanPhamTuongTu.length > 0 && (
        <div className="mt-16 container mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
            <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <HiOutlineSparkles className="w-8 h-8 text-pink-600" />
              <span>Sản phẩm tương tự</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {sanPhamTuongTu.map((sp) => (
                <ProductCard key={sp.id} product={sp} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tư vấn */}
      {showTuVanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  <HiOutlineChat className="w-8 h-8 text-pink-600" />
                  <span>Yêu cầu tư vấn</span>
                </h2>
                <button
                  onClick={() => {
                    setShowTuVanModal(false);
                    setTuVanForm({ ten: '', soDienThoai: '', email: '', cauHoi: '' });
                  }}
                  className="text-gray-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 hover:bg-pink-50 rounded-full p-2"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-5 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border-2 border-pink-200/50 shadow-lg">
                <p className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
                  <HiOutlineShoppingBag className="w-5 h-5 text-pink-600" />
                  <strong className="text-pink-600">Sản phẩm:</strong> {sanPham.ten}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-800 font-semibold mt-2">
                  <HiOutlineDocumentText className="w-5 h-5 text-purple-600" />
                  <strong className="text-purple-600">Giá:</strong> <span className="text-pink-600 font-bold">{formatPrice(sanPham.gia)}</span>
                </p>
              </div>

              <form onSubmit={handleSubmitTuVan} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlineUser className="w-5 h-5 text-pink-600" />
                    <span>Họ tên <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tuVanForm.ten}
                    onChange={(e) => setTuVanForm({ ...tuVanForm, ten: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlinePhone className="w-5 h-5 text-pink-600" />
                    <span>Số điện thoại <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={tuVanForm.soDienThoai}
                    onChange={(e) => setTuVanForm({ ...tuVanForm, soDienThoai: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlineMail className="w-5 h-5 text-pink-600" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={tuVanForm.email}
                    onChange={(e) => setTuVanForm({ ...tuVanForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                    placeholder="Nhập email (tùy chọn)"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                    <HiOutlineChat className="w-5 h-5 text-pink-600" />
                    <span>Câu hỏi / Yêu cầu tư vấn <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    required
                    value={tuVanForm.cauHoi}
                    onChange={(e) => setTuVanForm({ ...tuVanForm, cauHoi: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                    rows="4"
                    placeholder="Ví dụ: Tôi muốn biết về kích thước, chất liệu, chính sách bảo hành..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTuVanModal(false);
                      setTuVanForm({ ten: '', soDienThoai: '', email: '', cauHoi: '' });
                    }}
                    className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-pink-200 text-gray-700 py-3 rounded-2xl hover:bg-pink-50 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <HiOutlineMail className="w-5 h-5" />
                    Gửi yêu cầu
                  </button>
                </div>
              </form>

              <div className="mt-6 p-5 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border-2 border-pink-200/50 shadow-md">
                <p className="text-sm text-gray-700 font-bold mb-2">
                  📞 Hoặc liên hệ trực tiếp:
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  Hotline: <span className="text-pink-600 font-bold">1900-xxxx</span>
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  📧 Email: <span className="text-pink-600 font-bold">support@shopbandothethao.com</span>
                </p>
                  <button
                  onClick={() => {
                    const event = new CustomEvent('openChatbot', { detail: { product: sanPham } });
                    window.dispatchEvent(event);
                    setShowTuVanModal(false);
                  }}
                  className="flex items-center justify-center gap-2 mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <HiOutlineChat className="w-5 h-5" />
                  Chat trực tuyến
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal - Xem ảnh lớn */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md rounded-full p-3 hover:bg-white transition-all duration-300 shadow-xl hover:scale-110"
            >
              <HiOutlineX className="w-6 h-6 text-gray-800" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <ImageWithFallback
                src={hinhAnhHienTai || sanPham.hinhAnhChinh}
                alt={sanPham.ten}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Navigation buttons nếu có nhiều ảnh */}
            {danhSachHinhAnh.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = danhSachHinhAnh.findIndex(img => img === (hinhAnhHienTai || sanPham.hinhAnhChinh));
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : danhSachHinhAnh.length - 1;
                    setHinhAnhHienTai(danhSachHinhAnh[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-4 hover:bg-white transition-all duration-300 shadow-xl hover:scale-110 z-10"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = danhSachHinhAnh.findIndex(img => img === (hinhAnhHienTai || sanPham.hinhAnhChinh));
                    const nextIndex = currentIndex < danhSachHinhAnh.length - 1 ? currentIndex + 1 : 0;
                    setHinhAnhHienTai(danhSachHinhAnh[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-4 hover:bg-white transition-all duration-300 shadow-xl hover:scale-110 z-10"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChiTietSanPham;

