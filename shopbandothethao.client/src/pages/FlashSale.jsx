import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { flashSaleService } from '../services/flashSaleService';
import { gioHangService } from '../services/gioHangService';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import { HiOutlineClock, HiOutlineShoppingBag, HiOutlineStar, HiOutlineFire } from 'react-icons/hi';

function FlashSale() {
  const { id } = useParams();
  const [flashSale, setFlashSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    if (id) {
      loadFlashSale();
    }
  }, [id]);

  useEffect(() => {
    if (flashSale && flashSale.thoiGianConLai > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [flashSale]);

  const loadFlashSale = async () => {
    setLoading(true);
    try {
      const data = await flashSaleService.getFlashSaleById(id);
      setFlashSale(data);
      setTimeRemaining(Math.max(0, Math.floor(data.thoiGianConLai)));
    } catch (error) {
      toast.error('Không thể tải thông tin flash sale');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days} ngày ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = async (sanPhamId, giaFlashSale) => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [sanPhamId]: true }));
    try {
      await gioHangService.themVaoGioHang({
        sanPhamId,
        soLuong: 1,
        kichThuoc: null,
        mauSac: null,
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAddingToCart(prev => ({ ...prev, [sanPhamId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!flashSale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Flash Sale không tồn tại</h2>
          <Link to="/" className="text-pink-600 hover:text-pink-700">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header Flash Sale */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                <HiOutlineFire className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{flashSale.ten}</h1>
                {flashSale.moTa && (
                  <p className="text-white/90">{flashSale.moTa}</p>
                )}
              </div>
            </div>
            
            {/* Countdown Timer */}
            {timeRemaining > 0 && (
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border-2 border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineClock className="w-5 h-5" />
                  <span className="text-sm font-semibold">Còn lại:</span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {flashSale.danhSachSanPham && flashSale.danhSachSanPham.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flashSale.danhSachSanPham.map((item) => (
              <FlashSaleProductCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                isAdding={addingToCart[item.sanPham.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Chưa có sản phẩm trong flash sale này</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashSaleProductCard({ item, onAddToCart, isAdding }) {
  const [isHovered, setIsHovered] = useState(false);
  const { sanPham, giaFlashSale, phanTramGiam, soLuongConLai } = item;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const isOutOfStock = soLuongConLai !== null && soLuongConLai <= 0;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-pink-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <Link to={`/san-pham/${sanPham.id}`}>
          <ImageWithFallback
            src={getImageUrl(sanPham.hinhAnhChinh)}
            alt={sanPham.ten}
            className={`w-full h-64 object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </Link>

        {/* Flash Sale Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30 animate-pulse">
          ⚡ FLASH SALE -{phanTramGiam}%
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/90 rounded-xl px-6 py-3 text-center">
              <p className="text-red-600 font-bold text-lg">Hết hàng</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isOutOfStock && (
          <div
            className={`absolute inset-0 bg-gradient-to-br from-pink-500/0 group-hover:from-pink-500/20 to-purple-500/0 group-hover:to-purple-500/20 backdrop-blur-sm transition-all duration-500 flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={() => onAddToCart(sanPham.id, giaFlashSale)}
              disabled={isAdding}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <HiOutlineShoppingBag className="w-5 h-5" />
                  <span>Thêm vào giỏ</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 bg-gradient-to-br from-white to-pink-50/20">
        <Link to={`/san-pham/${sanPham.id}`}>
          <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 text-lg">
            {sanPham.ten}
          </h3>
        </Link>

        {/* Rating */}
        {sanPham.diemDanhGiaTrungBinh > 0 && sanPham.soLuongDanhGia > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-gray-800">
                {sanPham.diemDanhGiaTrungBinh.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-600 font-semibold">
              ({sanPham.soLuongDanhGia} đánh giá)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(giaFlashSale)}
            </span>
            {sanPham.gia > giaFlashSale && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {formatPrice(sanPham.gia)}
              </span>
            )}
          </div>
          {soLuongConLai !== null && soLuongConLai > 0 && (
            <p className="text-xs text-red-600 font-semibold">
              Còn lại: {soLuongConLai} sản phẩm
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs">
          {sanPham.soLuongTon > 0 ? (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold">
              ✓ Còn hàng
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full font-semibold">
              ✗ Hết hàng
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashSale;

