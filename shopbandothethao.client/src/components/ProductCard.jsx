import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gioHangService } from '../services/gioHangService';
import { yeuThichService } from '../services/yeuThichService';
import { authService } from '../services/authService';
import { sanPhamService } from '../services/sanPhamService';
import QuickViewModal from './QuickViewModal';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';
import { HiOutlineStar, HiOutlineShoppingBag } from 'react-icons/hi';

function ProductCard({ product: initialProduct, onQuickView, onProductUpdate }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [product, setProduct] = useState(initialProduct);

  // Cập nhật product khi initialProduct thay đổi
  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (authService.isAuthenticated() && product?.id) {
      checkFavorite();
    }
  }, [product?.id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Tính phần trăm giảm giá
  const calculateDiscount = () => {
    if (product.giaGoc && product.giaGoc > product.gia) {
      const discount = ((product.giaGoc - product.gia) / product.giaGoc) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setShowQuickView(true);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    setIsAddingToCart(true);
    try {
      await gioHangService.themVaoGioHang({
        sanPhamId: product.id,
        soLuong: 1,
        kichThuoc: null,
        mauSac: null,
      });
      toast.success('Đã thêm vào giỏ hàng!');
      
      // Reload thông tin sản phẩm để cập nhật số lượng tồn kho
      try {
        const updatedProduct = await sanPhamService.getById(product.id);
        setProduct(updatedProduct);
        // Gọi callback nếu có để parent component cũng cập nhật
        if (onProductUpdate) {
          onProductUpdate(updatedProduct);
        }
      } catch (error) {
        // Silently fail - không ảnh hưởng đến UX
        console.error('Không thể cập nhật thông tin sản phẩm:', error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const result = await yeuThichService.kiemTraYeuThich(product.id);
      setIsFavorite(result.isFavorite || false);
    } catch (error) {
      // Silently fail
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isFavorite) {
        await yeuThichService.xoaKhoiYeuThichBySanPhamId(product.id);
        setIsFavorite(false);
        toast.success('Đã xóa khỏi yêu thích');
      } else {
        await yeuThichService.themVaoYeuThich(product.id);
        setIsFavorite(true);
        toast.success('Đã thêm vào yêu thích!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-white to-pink-50/30 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-pink-100/50 hover:border-pink-300/50 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <Link to={`/san-pham/${product.id}`}>
          <ImageWithFallback
            src={product.hinhAnhChinh}
            alt={product.ten}
            className={`w-full h-64 object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </Link>

        {/* Badge giảm giá */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
            -{discountPercent}%
          </div>
        )}

        {/* Badge nổi bật */}
        {product.sanPhamNoiBat && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
            ⭐ Nổi bật
          </div>
        )}

        {/* Action Buttons - Hiển thị khi hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-pink-500/0 group-hover:from-pink-500/20 to-purple-500/0 group-hover:to-purple-500/20 backdrop-blur-sm transition-all duration-500 flex items-center justify-center gap-3 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="bg-white/95 backdrop-blur-md p-4 rounded-2xl hover:bg-gradient-to-br hover:from-pink-400 hover:to-purple-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-xl border-2 border-white/50"
            title="Xem nhanh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-xl border-2 border-white/50 disabled:opacity-50 ${
              isFavorite
                ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white'
                : 'bg-white/95 backdrop-blur-md hover:bg-gradient-to-br hover:from-pink-400 hover:to-red-400 hover:text-white'
            }`}
            title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            {isAddingToWishlist ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-white/95 backdrop-blur-md p-4 rounded-2xl hover:bg-gradient-to-br hover:from-emerald-400 hover:to-teal-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-xl border-2 border-white/50 disabled:opacity-50"
            title="Thêm vào giỏ hàng"
          >
            {isAddingToCart ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 bg-gradient-to-br from-white to-pink-50/20 flex-1 flex flex-col">
        <Link to={`/san-pham/${product.id}`}>
          <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 text-lg">
            {product.ten}
          </h3>
        </Link>

        {/* Rating & Sales */}
        <div className="flex items-center justify-between mb-3">
          {/* Rating */}
          {product.diemDanhGiaTrungBinh > 0 && product.soLuongDanhGia > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-800">
                  {product.diemDanhGiaTrungBinh.toFixed(1)}
                </span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.diemDanhGiaTrungBinh)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-semibold">
                ({product.soLuongDanhGia || 0} đánh giá)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400">
              <HiOutlineStar className="w-4 h-4" />
              <span className="text-xs font-medium">Chưa có đánh giá</span>
            </div>
          )}

          {/* Sales Count */}
          {product.soLuongBan !== undefined && product.soLuongBan > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <HiOutlineShoppingBag className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-semibold">
                Đã bán {product.soLuongBan.toLocaleString('vi-VN')}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {formatPrice(product.gia)}
          </span>
          {product.giaGoc && product.giaGoc > product.gia && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {formatPrice(product.giaGoc)}
            </span>
          )}
        </div>

        {/* Stock Status - Luôn hiển thị để đảm bảo chiều cao đồng nhất */}
        <div className="text-xs mt-auto">
          {product.soLuongTon !== undefined && product.soLuongTon > 0 ? (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold">
              ✓ Còn hàng ({product.soLuongTon})
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full font-semibold">
              ✗ Hết hàng
            </span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
}

export default ProductCard;

