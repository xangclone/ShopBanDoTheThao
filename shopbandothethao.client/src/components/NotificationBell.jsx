import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import thongBaoService from '../services/thongBaoService';
import { HiOutlineBell, HiOutlineX, HiOutlineCheckCircle } from 'react-icons/hi';
import { formatVietnamDateTimeFull } from '../utils/dateUtils';

function NotificationBell() {
  const navigate = useNavigate();
  const [thongBao, setThongBao] = useState([]);
  const [soLuongChuaDoc, setSoLuongChuaDoc] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChiTietModal, setShowChiTietModal] = useState(false);
  const [chiTietThongBao, setChiTietThongBao] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadThongBao();
    loadSoLuongChuaDoc();

    // Auto refresh mỗi 30 giây
    const interval = setInterval(() => {
      loadThongBao();
      loadSoLuongChuaDoc();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadThongBao = async () => {
    try {
      const data = await thongBaoService.getThongBao();
      setThongBao(data || []);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    }
  };

  const loadSoLuongChuaDoc = async () => {
    try {
      const data = await thongBaoService.getSoLuongChuaDoc();
      setSoLuongChuaDoc(data?.count || 0);
    } catch (error) {
      console.error('Lỗi khi đếm thông báo:', error);
    }
  };

  const handleDanhDauDaDoc = async (id) => {
    try {
      await thongBaoService.danhDauDaDoc(id);
      loadThongBao();
      loadSoLuongChuaDoc();
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const handleDanhDauTatCaDaDoc = async () => {
    try {
      await thongBaoService.danhDauTatCaDaDoc();
      loadThongBao();
      loadSoLuongChuaDoc();
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
    }
  };

  const handleXoa = async (id, e) => {
    e.stopPropagation();
    try {
      await thongBaoService.xoaThongBao(id);
      loadThongBao();
      loadSoLuongChuaDoc();
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
    }
  };

  const handleClickThongBao = (thongBao) => {
    handleDanhDauDaDoc(thongBao.id);
    setChiTietThongBao(thongBao);
    setShowChiTietModal(true);
    setIsOpen(false);
  };

  const handleChuyenDenTrang = () => {
    if (chiTietThongBao?.lienKet) {
      navigate(chiTietThongBao.lienKet);
      setShowChiTietModal(false);
      setChiTietThongBao(null);
    }
  };

  const getLoaiIcon = (loai) => {
    switch (loai) {
      case 'DonHang':
        return '📦';
      case 'DealHot':
        return '🔥';
      case 'KhuyenMai':
        return '🎁';
      default:
        return '🔔';
    }
  };

  const getLoaiColor = (loai) => {
    switch (loai) {
      case 'DonHang':
        return 'from-blue-500 to-indigo-500';
      case 'DealHot':
        return 'from-red-500 to-orange-500';
      case 'KhuyenMai':
        return 'from-pink-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 md:p-3 rounded-full hover:bg-pink-50 transition-all duration-300 hover:scale-110"
        aria-label="Thông báo"
      >
        <HiOutlineBell className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
        {soLuongChuaDoc > 0 && (
          <span className="absolute -top-1 -right-1 md:top-0 md:right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shadow-lg">
            {soLuongChuaDoc > 9 ? '9+' : soLuongChuaDoc}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed md:absolute right-0 md:right-0 top-16 md:top-auto md:mt-2 w-screen md:w-96 max-w-md md:max-w-none mx-auto md:mx-0 max-h-[calc(100vh-5rem)] md:max-h-[600px] overflow-y-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-pink-100/50 z-50">
          <div className="sticky top-0 bg-gradient-to-r from-pink-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-sm border-b-2 border-pink-100/50 p-3 md:p-4 flex items-center justify-between rounded-t-2xl">
            <h3 className="font-bold text-base md:text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Thông báo
            </h3>
            {soLuongChuaDoc > 0 && (
              <button
                onClick={handleDanhDauTatCaDaDoc}
                className="text-[10px] md:text-xs text-pink-600 hover:text-purple-600 font-semibold transition-colors whitespace-nowrap ml-2"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="p-2 md:p-2">
            {thongBao.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <HiOutlineBell className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium text-sm md:text-base">Chưa có thông báo</p>
              </div>
            ) : (
              thongBao.map((tb) => (
                <div
                  key={tb.id}
                  onClick={() => handleClickThongBao(tb)}
                  className={`p-3 md:p-4 rounded-xl mb-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    !tb.daDoc
                      ? 'bg-gradient-to-r from-pink-50/80 to-purple-50/80 border-2 border-pink-200'
                      : 'bg-white/60 border border-pink-100/50'
                  }`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r ${getLoaiColor(tb.loai)} flex items-center justify-center text-white text-base md:text-lg`}>
                      {getLoaiIcon(tb.loai)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-bold text-xs md:text-sm ${!tb.daDoc ? 'text-gray-900' : 'text-gray-700'} line-clamp-2`}>
                          {tb.tieuDe}
                        </h4>
                        {!tb.daDoc && (
                          <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs text-gray-600 mt-1 line-clamp-2">{tb.noiDung}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 mt-1 md:mt-2">
                        {formatVietnamDateTimeFull(new Date(tb.ngayTao))}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleXoa(tb.id, e)}
                      className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Xóa thông báo"
                    >
                      <HiOutlineX className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Chi tiết thông báo */}
      {showChiTietModal && chiTietThongBao && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-3 md:p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-lg max-h-[90vh] overflow-y-auto my-auto">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-pink-100/50 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center rounded-t-2xl md:rounded-t-3xl">
              <h2 className="flex items-center gap-2 text-lg md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                <HiOutlineBell className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                <span className="hidden sm:inline">Chi tiết thông báo</span>
                <span className="sm:hidden">Chi tiết</span>
              </h2>
              <button
                onClick={() => {
                  setShowChiTietModal(false);
                  setChiTietThongBao(null);
                }}
                className="text-gray-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 hover:bg-pink-50 rounded-full p-1.5 md:p-2"
                aria-label="Đóng"
              >
                <HiOutlineX className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              {/* Icon và loại */}
              <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 border-pink-200/50">
                <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${getLoaiColor(chiTietThongBao.loai)} flex items-center justify-center text-white text-xl md:text-2xl shadow-lg`}>
                  {getLoaiIcon(chiTietThongBao.loai)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-700 font-bold">
                    {chiTietThongBao.loai === 'DonHang' ? '📦 Đơn hàng' : 
                     chiTietThongBao.loai === 'DealHot' ? '🔥 Deal Hot' : 
                     chiTietThongBao.loai === 'KhuyenMai' ? '🎁 Khuyến mãi' : 
                     chiTietThongBao.loai === 'CanhBao' ? '⚠️ Cảnh báo' :
                     chiTietThongBao.loai === 'AdminDonHang' ? '📋 Thông báo Admin' : '🔔 Hệ thống'}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                    {formatVietnamDateTimeFull(new Date(chiTietThongBao.ngayTao))}
                  </p>
                </div>
              </div>

              {/* Tiêu đề */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                  {chiTietThongBao.tieuDe}
                </h3>
              </div>

              {/* Nội dung */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border-2 border-pink-100/50 shadow-md">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
                  {chiTietThongBao.noiDung || 'Không có nội dung chi tiết.'}
                </p>
              </div>

              {/* Nút hành động */}
              {chiTietThongBao.lienKet && (
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowChiTietModal(false);
                      setChiTietThongBao(null);
                    }}
                    className="flex-1 px-4 py-2.5 md:py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-200 text-gray-700 rounded-xl md:rounded-2xl hover:bg-pink-50 font-bold text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleChuyenDenTrang}
                    className="flex-1 px-4 py-2.5 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl md:rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}

              {!chiTietThongBao.lienKet && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      setShowChiTietModal(false);
                      setChiTietThongBao(null);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl md:rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

