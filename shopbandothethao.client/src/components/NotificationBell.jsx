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
    if (thongBao.lienKet) {
      navigate(thongBao.lienKet);
      setIsOpen(false);
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
        className="relative p-2 rounded-full hover:bg-pink-50 transition-all duration-300 hover:scale-110"
      >
        <HiOutlineBell className="w-6 h-6 text-pink-600" />
        {soLuongChuaDoc > 0 && (
          <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {soLuongChuaDoc > 9 ? '9+' : soLuongChuaDoc}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-y-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-pink-100/50 z-50">
          <div className="sticky top-0 bg-gradient-to-r from-pink-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-sm border-b-2 border-pink-100/50 p-4 flex items-center justify-between rounded-t-2xl">
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Thông báo
            </h3>
            {soLuongChuaDoc > 0 && (
              <button
                onClick={handleDanhDauTatCaDaDoc}
                className="text-xs text-pink-600 hover:text-purple-600 font-semibold transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="p-2">
            {thongBao.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <HiOutlineBell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">Chưa có thông báo</p>
              </div>
            ) : (
              thongBao.map((tb) => (
                <div
                  key={tb.id}
                  onClick={() => handleClickThongBao(tb)}
                  className={`p-4 rounded-xl mb-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    !tb.daDoc
                      ? 'bg-gradient-to-r from-pink-50/80 to-purple-50/80 border-2 border-pink-200'
                      : 'bg-white/60 border border-pink-100/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${getLoaiColor(tb.loai)} flex items-center justify-center text-white text-lg`}>
                      {getLoaiIcon(tb.loai)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-bold text-sm ${!tb.daDoc ? 'text-gray-900' : 'text-gray-700'}`}>
                          {tb.tieuDe}
                        </h4>
                        {!tb.daDoc && (
                          <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tb.noiDung}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatVietnamDateTimeFull(new Date(tb.ngayTao))}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleXoa(tb.id, e)}
                      className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <HiOutlineX className="w-4 h-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

