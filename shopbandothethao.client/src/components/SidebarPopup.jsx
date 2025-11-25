import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gioHangService } from '../services/gioHangService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineX, HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiOutlineCreditCard, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi';

function SidebarPopup({ isOpen, onClose, type = 'gioHang' }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set()); // Set các ID sản phẩm đã chọn

  useEffect(() => {
    if (isOpen && type === 'gioHang') {
      loadGioHang();
    } else if (isOpen && type === 'yeuThich') {
      // TODO: Load yêu thích
      setItems([]);
    }
  }, [isOpen, type]);

  // Tự động chọn tất cả khi load giỏ hàng
  useEffect(() => {
    if (items.length > 0 && selectedItems.size === 0 && type === 'gioHang') {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  }, [items, type]);

  const loadGioHang = async () => {
    setLoading(true);
    try {
      const data = await gioHangService.getGioHang();
      setItems(data || []);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      setItems([]);
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
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Tính tổng tiền chỉ cho các sản phẩm đã chọn
  const tongTien = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => {
      return sum + (item.sanPham?.gia || 0) * item.soLuong;
    }, 0);

  // Lấy danh sách sản phẩm đã chọn
  const selectedGioHangItems = items.filter(item => selectedItems.has(item.id));

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border-l-2 border-pink-100/50 z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm border-b-2 border-pink-100/50">
          <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {type === 'gioHang' ? (
              <>
                <HiOutlineShoppingCart className="w-7 h-7 text-pink-600" />
                <span>Giỏ hàng</span>
              </>
            ) : (
              <>
                <HiOutlineHeart className="w-7 h-7 text-pink-600" />
                <span>Yêu thích</span>
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full transition-all duration-300 hover:scale-110"
          >
            <HiOutlineX className="w-6 h-6 text-gray-500 hover:text-pink-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-pink-50/30">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-6">
                {type === 'gioHang' ? (
                  <HiOutlineShoppingCart className="w-20 h-20 text-pink-300" />
                ) : (
                  <HiOutlineHeart className="w-20 h-20 text-pink-300" />
                )}
              </div>
              <p className="text-xl font-bold text-gray-700 mb-4">
                {type === 'gioHang' ? 'Giỏ hàng trống' : 'Chưa có sản phẩm yêu thích'}
              </p>
              <Link
                to="/san-pham"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-pink-600 hover:text-purple-600 font-bold transition-colors"
              >
                <HiOutlineArrowRight className="w-5 h-5" />
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chọn tất cả - chỉ hiển thị cho giỏ hàng */}
              {type === 'gioHang' && items.length > 0 && (
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50 p-4 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === items.length && items.length > 0}
                        onChange={handleToggleAll}
                        className="w-5 h-5 rounded-lg border-2 border-pink-300 text-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer appearance-none checked:bg-gradient-to-r checked:from-pink-500 checked:to-purple-500 checked:border-pink-500 transition-all duration-300"
                      />
                      {selectedItems.size === items.length && items.length > 0 && (
                        <HiOutlineCheckCircle className="w-5 h-5 text-white absolute top-0 left-0 pointer-events-none" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                      Chọn tất cả ({selectedItems.size}/{items.length})
                    </span>
                  </label>
                </div>
              )}

              {items.map((item) => (
                <div key={item.id} className={`bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-2 p-4 hover:shadow-xl transition-all duration-300 ${
                  selectedItems.has(item.id) && type === 'gioHang'
                    ? 'border-pink-400 ring-2 ring-pink-200' 
                    : 'border-pink-100/50'
                }`}>
                  <div className="flex gap-4">
                    {/* Checkbox chọn sản phẩm - chỉ hiển thị cho giỏ hàng */}
                    {type === 'gioHang' && (
                      <div className="flex-shrink-0 flex items-start pt-1">
                        <label className="cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                              className="w-5 h-5 rounded-lg border-2 border-pink-300 text-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer appearance-none checked:bg-gradient-to-r checked:from-pink-500 checked:to-purple-500 checked:border-pink-500 transition-all duration-300"
                            />
                            {selectedItems.has(item.id) && (
                              <HiOutlineCheckCircle className="w-5 h-5 text-white absolute top-0 left-0 pointer-events-none" />
                            )}
                          </div>
                        </label>
                      </div>
                    )}
                    <Link
                      to={`/san-pham/${item.sanPham?.id}`}
                      onClick={onClose}
                      className="flex-shrink-0"
                    >
                      <ImageWithFallback
                        src={getImageUrl(item.sanPham?.hinhAnhChinh)}
                        alt={item.sanPham?.ten}
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/san-pham/${item.sanPham?.id}`}
                        onClick={onClose}
                        className="font-bold text-gray-800 hover:text-pink-600 transition-colors line-clamp-2 mb-2"
                      >
                        {item.sanPham?.ten}
                      </Link>
                      {item.kichThuoc && (
                        <p className="text-sm text-gray-600 mb-1">Size: <span className="font-semibold">{item.kichThuoc}</span></p>
                      )}
                      {item.mauSac && (
                        <p className="text-sm text-gray-600 mb-2">Màu: <span className="font-semibold">{item.mauSac}</span></p>
                      )}
                      <p className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        {formatPrice(item.sanPham?.gia || 0)}
                      </p>
                      {type === 'gioHang' && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-pink-100 p-1">
                            <button
                              onClick={() => handleCapNhatSoLuong(item.id, item.soLuong - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-pink-50 transition-colors"
                            >
                              <HiOutlineMinus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-800">{item.soLuong}</span>
                            <button
                              onClick={() => handleCapNhatSoLuong(item.id, item.soLuong + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-pink-50 transition-colors"
                            >
                              <HiOutlinePlus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleXoa(item.id)}
                            className="ml-auto p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-110"
                          >
                            <HiOutlineTrash className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {type === 'gioHang' && items.length > 0 && (
          <div className="border-t-2 border-pink-100/50 p-6 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(tongTien)}
              </span>
            </div>
            <button
              onClick={() => {
                if (selectedItems.size === 0) {
                  toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
                  return;
                }
                // Lưu danh sách sản phẩm đã chọn vào sessionStorage để trang thanh toán có thể đọc
                sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedGioHangItems.map(item => item.id)));
                onClose();
                navigate('/thanh-toan');
              }}
              disabled={selectedItems.size === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <HiOutlineCreditCard className="w-5 h-5" />
              Thanh toán ({selectedItems.size})
            </button>
            <Link
              to="/gio-hang"
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-center text-pink-600 hover:text-purple-600 font-bold transition-colors"
            >
              <span>Xem chi tiết giỏ hàng</span>
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default SidebarPopup;



