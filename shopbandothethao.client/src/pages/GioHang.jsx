import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gioHangService } from '../services/gioHangService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import { HiOutlineShoppingCart, HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineCreditCard, HiOutlineCheckCircle } from 'react-icons/hi';

function GioHang() {
  const navigate = useNavigate();
  const [gioHang, setGioHang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set()); // Set các ID sản phẩm đã chọn

  useEffect(() => {
    loadGioHang();
  }, []);

  // Tự động chọn tất cả khi load giỏ hàng
  useEffect(() => {
    if (gioHang.length > 0 && selectedItems.size === 0) {
      setSelectedItems(new Set(gioHang.map(item => item.id)));
    }
  }, [gioHang]);

  const loadGioHang = async () => {
    try {
      const data = await gioHangService.getGioHang();
      setGioHang(data);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapNhatSoLuong = async (id, soLuong) => {
    if (soLuong < 1) return;
    try {
      await gioHangService.capNhatGioHang(id, { soLuong });
      loadGioHang();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật');
    }
  };

  const handleXoa = async (id) => {
    try {
      await gioHangService.xoaKhoiGioHang(id);
      toast.success('Đã xóa khỏi giỏ hàng');
      // Xóa khỏi danh sách đã chọn
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      loadGioHang();
    } catch (error) {
      toast.error('Không thể xóa');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Toggle chọn/bỏ chọn một sản phẩm
  const handleToggleItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Chọn/bỏ chọn tất cả
  const handleToggleAll = () => {
    if (selectedItems.size === gioHang.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(gioHang.map(item => item.id)));
    }
  };

  // Tính tổng tiền chỉ cho các sản phẩm đã chọn
  const tongTien = gioHang
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.sanPham.gia * item.soLuong, 0);

  // Lấy danh sách sản phẩm đã chọn
  const selectedGioHangItems = gioHang.filter(item => selectedItems.has(item.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (gioHang.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-12 text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <HiOutlineShoppingCart className="w-20 h-20 text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8 font-medium">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <button
            onClick={() => navigate('/san-pham')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mx-auto"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <HiOutlineShoppingCart className="w-10 h-10 text-pink-600" />
          <span>Giỏ hàng</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Chọn tất cả */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50 p-4 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === gioHang.length && gioHang.length > 0}
                    onChange={handleToggleAll}
                    className="w-6 h-6 rounded-lg border-2 border-pink-300 text-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer appearance-none checked:bg-gradient-to-r checked:from-pink-500 checked:to-purple-500 checked:border-pink-500 transition-all duration-300"
                  />
                  {selectedItems.size === gioHang.length && gioHang.length > 0 && (
                    <HiOutlineCheckCircle className="w-6 h-6 text-white absolute top-0 left-0 pointer-events-none" />
                  )}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                  Chọn tất cả ({selectedItems.size}/{gioHang.length})
                </span>
              </label>
            </div>

            {gioHang.map((item) => (
              <div
                key={item.id}
                className={`bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition-all duration-300 ${
                  selectedItems.has(item.id) 
                    ? 'border-pink-400 ring-2 ring-pink-200' 
                    : 'border-pink-100/50'
                }`}
              >
                {/* Checkbox chọn sản phẩm */}
                <div className="flex-shrink-0">
                  <label className="cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-6 h-6 rounded-lg border-2 border-pink-300 text-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer appearance-none checked:bg-gradient-to-r checked:from-pink-500 checked:to-purple-500 checked:border-pink-500 transition-all duration-300"
                      />
                      {selectedItems.has(item.id) && (
                        <HiOutlineCheckCircle className="w-6 h-6 text-white absolute top-0 left-0 pointer-events-none" />
                      )}
                    </div>
                  </label>
                </div>
                <ImageWithFallback
                  src={item.sanPham.hinhAnhChinh}
                  alt={item.sanPham.ten}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl shadow-lg"
                />
                <div className="flex-grow flex-1">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{item.sanPham.ten}</h3>
                  <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {formatPrice(item.sanPham.gia)}
                  </p>
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      onClick={() => handleCapNhatSoLuong(item.id, item.soLuong - 1)}
                      className="w-10 h-10 border-2 border-pink-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      <HiOutlineMinus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl font-bold text-lg text-gray-800 shadow-md">
                      {item.soLuong}
                    </span>
                    <button
                      onClick={() => handleCapNhatSoLuong(item.id, item.soLuong + 1)}
                      className="w-10 h-10 border-2 border-pink-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(item.sanPham.gia * item.soLuong)}
                  </p>
                  <button
                    onClick={() => handleXoa(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6 sticky top-24">
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                <HiOutlineCreditCard className="w-7 h-7 text-pink-600" />
                <span>Tổng thanh toán</span>
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(tongTien)}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Phí vận chuyển:</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
                <div className="border-t-2 border-pink-200 pt-4 flex justify-between font-bold text-xl">
                  <span className="text-gray-800">Tổng cộng:</span>
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-2xl">
                    {formatPrice(tongTien)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (selectedItems.size === 0) {
                    toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
                    return;
                  }
                  // Lưu danh sách sản phẩm đã chọn vào sessionStorage để trang thanh toán có thể đọc
                  sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedGioHangItems.map(item => item.id)));
                  navigate('/thanh-toan');
                }}
                disabled={selectedItems.size === 0}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <HiOutlineCreditCard className="w-5 h-5" />
                Thanh toán ({selectedItems.size})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GioHang;

