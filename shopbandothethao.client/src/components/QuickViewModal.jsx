import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { gioHangService } from '../services/gioHangService';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';
import { 
  HiOutlineX, 
  HiOutlineShoppingCart, 
  HiOutlineEye, 
  HiOutlineMinus, 
  HiOutlinePlus,
  HiOutlineStar,
  HiOutlineDocumentText,
  HiOutlineSparkles
} from 'react-icons/hi';

function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const [sanPham, setSanPham] = useState(null);
  const [loading, setLoading] = useState(false);
  const [soLuong, setSoLuong] = useState(1);
  const [kichThuoc, setKichThuoc] = useState('');
  const [mauSac, setMauSac] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [danhSachHinhAnh, setDanhSachHinhAnh] = useState([]);
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      loadSanPham();
    }
  }, [isOpen, product]);

  const loadSanPham = async () => {
    if (!product?.id) return;
    
    setLoading(true);
    try {
      const data = await sanPhamService.getById(product.id);
      setSanPham(data);
      
      // Tạo danh sách hình ảnh từ sản phẩm và biến thể
      const images = [];
      
      // Thêm hình ảnh chính
      if (data.hinhAnhChinh) {
        images.push(getImageUrl(data.hinhAnhChinh));
      }
      
      // Thêm hình ảnh từ danh sách hình ảnh (nếu có)
      if (data.danhSachHinhAnh) {
        try {
          const imageList = typeof data.danhSachHinhAnh === 'string' 
            ? JSON.parse(data.danhSachHinhAnh) 
            : data.danhSachHinhAnh;
          if (Array.isArray(imageList)) {
            imageList.forEach(img => {
              if (img && img !== data.hinhAnhChinh) {
                images.push(getImageUrl(img));
              }
            });
          }
        } catch (e) {
          // Nếu không parse được, bỏ qua
        }
      }
      
      // Thêm hình ảnh từ các biến thể (nếu có và chưa có trong danh sách)
      if (data.danhSachBienThe && data.danhSachBienThe.length > 0) {
        data.danhSachBienThe.forEach(variant => {
          if (variant.hinhAnh) {
            const variantImageUrl = getImageUrl(variant.hinhAnh);
            if (!images.includes(variantImageUrl)) {
              images.push(variantImageUrl);
            }
          }
        });
      }
      
      setDanhSachHinhAnh(images);
      
      // Tự động chọn biến thể đầu tiên nếu có
      if (data.danhSachBienThe && data.danhSachBienThe.length > 0) {
        const firstVariant = data.danhSachBienThe[0];
        setKichThuoc(firstVariant.kichThuoc || '');
        setMauSac(firstVariant.mauSac || '');
        // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
        if (firstVariant.hinhAnh) {
          setHinhAnhHienTai(getImageUrl(firstVariant.hinhAnh));
        } else {
          setHinhAnhHienTai(getImageUrl(data.hinhAnhChinh));
        }
      } else {
        setHinhAnhHienTai(getImageUrl(data.hinhAnhChinh));
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Lấy danh sách size và màu sắc duy nhất từ biến thể
  const getAvailableSizes = () => {
    if (!sanPham?.danhSachBienThe) return [];
    const sizes = [...new Set(sanPham.danhSachBienThe.map(v => v.kichThuoc).filter(Boolean))];
    return sizes.sort();
  };

  const getAvailableColors = () => {
    if (!sanPham?.danhSachBienThe) return [];
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

  // Tính phần trăm giảm giá
  const calculateDiscount = () => {
    if (sanPham?.giaGoc && sanPham.giaGoc > sanPham.gia) {
      const discount = ((sanPham.giaGoc - sanPham.gia) / sanPham.giaGoc) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();
  const availableQty = getAvailableQuantity();
  
  // Sử dụng danhSachHinhAnh từ state, fallback về cách cũ nếu chưa có
  const images = danhSachHinhAnh.length > 0 
    ? danhSachHinhAnh 
    : (sanPham?.danhSachHinhAnh 
        ? [sanPham.hinhAnhChinh, ...sanPham.danhSachHinhAnh].filter(Boolean).map(img => getImageUrl(img))
        : [sanPham?.hinhAnhChinh || product.hinhAnhChinh].filter(Boolean).map(img => getImageUrl(img)));
  
  // Ảnh hiện tại để hiển thị
  const currentImage = hinhAnhHienTai || images[selectedImage] || sanPham?.hinhAnhChinh || product.hinhAnhChinh;

  const handleThemVaoGioHang = async () => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (soLuong > availableQty) {
      toast.error(`Chỉ còn ${availableQty} sản phẩm trong kho`);
      setSoLuong(Math.max(1, availableQty));
      return;
    }

    try {
      await gioHangService.themVaoGioHang({
        sanPhamId: product.id,
        soLuong,
        kichThuoc: kichThuoc || null,
        mauSac: mauSac || null,
      });
      toast.success('Đã thêm vào giỏ hàng!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleXemChiTiet = () => {
    onClose();
    navigate(`/san-pham/${product.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin sản phẩm...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 backdrop-blur-md border-b-2 border-pink-100/50 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                <HiOutlineEye className="w-6 h-6 text-pink-600" />
                <span>Xem nhanh sản phẩm</span>
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 text-gray-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-indigo-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  <div 
                    className="relative mb-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-2 shadow-lg cursor-pointer group overflow-hidden"
                    onClick={() => setShowImageModal(true)}
                  >
                    <ImageWithFallback
                      src={currentImage}
                      alt={sanPham?.ten || product.ten}
                      className="w-full h-96 object-contain rounded-xl shadow-md transition-all duration-500 group-hover:scale-105"
                    />
                    {discountPercent > 0 && (
                      <div className="absolute top-5 left-5 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30 z-10">
                        -{discountPercent}%
                      </div>
                    )}
                    {/* Zoom icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {images.map((img, index) => {
                        const isActive = currentImage === img || (selectedImage === index && !hinhAnhHienTai);
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedImage(index);
                              setHinhAnhHienTai(img);
                            }}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                              isActive
                                ? 'border-pink-500 ring-2 ring-pink-300 ring-offset-2 scale-105' 
                                : 'border-pink-200 hover:border-pink-300'
                            }`}
                          >
                            <ImageWithFallback
                              src={img}
                              alt={`${sanPham?.ten || product.ten} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border-2 border-pink-100/50">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 hover:text-pink-600 transition-colors">{sanPham?.ten || product.ten}</h3>
                  
                  {/* Rating */}
                  {sanPham?.diemDanhGiaTrungBinh > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <HiOutlineStar
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(sanPham.diemDanhGiaTrungBinh) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {sanPham.diemDanhGiaTrungBinh.toFixed(1)} ({sanPham.soLuongDanhGia || 0} đánh giá)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(sanPham?.gia || product.gia)}
                      </span>
                      {sanPham?.giaGoc && sanPham.giaGoc > sanPham.gia && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(sanPham.giaGoc)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">
                      {availableQty > 0 ? (
                        <span className="text-emerald-600">✓ Còn hàng ({availableQty} sản phẩm)</span>
                      ) : (
                        <span className="text-red-600">✗ Hết hàng</span>
                      )}
                    </p>
                  </div>

                  {/* Description */}
                  {sanPham?.moTa && (
                    <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100">
                      <p className="text-gray-700 text-sm line-clamp-3">{sanPham.moTa}</p>
                    </div>
                  )}

                  {/* Size Selection */}
                  {getAvailableSizes().length > 0 && (
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                        <HiOutlineDocumentText className="w-5 h-5 text-pink-600" />
                        <span>Kích thước</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableSizes().map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setKichThuoc(size);
                              setMauSac(''); // Reset màu khi đổi size
                              
                              // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
                              if (sanPham?.danhSachBienThe) {
                                const variant = sanPham.danhSachBienThe.find(v => v.kichThuoc === size);
                                if (variant?.hinhAnh) {
                                  setHinhAnhHienTai(getImageUrl(variant.hinhAnh));
                                  const imageIndex = danhSachHinhAnh.findIndex(img => img === getImageUrl(variant.hinhAnh));
                                  if (imageIndex >= 0) {
                                    setSelectedImage(imageIndex);
                                  }
                                }
                              }
                            }}
                            className={`px-4 py-2 border-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                              kichThuoc === size
                                ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                                : 'border-pink-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-pink-400 hover:bg-pink-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {getAvailableColors().length > 0 && (
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                        <HiOutlineSparkles className="w-5 h-5 text-pink-600" />
                        <span>Màu sắc</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableColors().map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setMauSac(color);
                              
                              // Cập nhật hình ảnh nếu biến thể có hình ảnh riêng
                              if (sanPham?.danhSachBienThe) {
                                const variant = sanPham.danhSachBienThe.find(v => 
                                  (v.kichThuoc === kichThuoc || !kichThuoc) && v.mauSac === color
                                );
                                if (variant?.hinhAnh) {
                                  setHinhAnhHienTai(getImageUrl(variant.hinhAnh));
                                  const imageIndex = danhSachHinhAnh.findIndex(img => img === getImageUrl(variant.hinhAnh));
                                  if (imageIndex >= 0) {
                                    setSelectedImage(imageIndex);
                                  }
                                }
                              }
                            }}
                            className={`px-4 py-2 border-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                              mauSac === color
                                ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                                : 'border-pink-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:border-pink-400 hover:bg-pink-50'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-700">
                      <HiOutlineDocumentText className="w-5 h-5 text-pink-600" />
                      <span>Số lượng</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setSoLuong(Math.max(1, soLuong - 1))}
                        className="w-10 h-10 border-2 border-pink-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={soLuong <= 1}
                      >
                        <HiOutlineMinus className="w-5 h-5" />
                      </button>
                      <span className="px-6 py-2 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl font-bold text-lg text-gray-800 shadow-md">
                        {soLuong}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const maxQty = availableQty;
                          setSoLuong(Math.min(maxQty, soLuong + 1));
                        }}
                        className="w-10 h-10 border-2 border-pink-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={soLuong >= availableQty}
                      >
                        <HiOutlinePlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleThemVaoGioHang}
                      disabled={availableQty === 0}
                      className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <HiOutlineShoppingCart className="w-5 h-5" />
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      onClick={handleXemChiTiet}
                      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-pink-400 text-pink-600 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <HiOutlineEye className="w-5 h-5" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Modal - Xem ảnh lớn */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
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
                src={currentImage}
                alt={sanPham?.ten || product.ten}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Navigation buttons nếu có nhiều ảnh */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = images.findIndex(img => img === currentImage);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                    setHinhAnhHienTai(images[prevIndex]);
                    setSelectedImage(prevIndex);
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
                    const currentIndex = images.findIndex(img => img === currentImage);
                    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                    setHinhAnhHienTai(images[nextIndex]);
                    setSelectedImage(nextIndex);
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

export default QuickViewModal;


