import { useState, useEffect, useRef } from 'react';
import { tinNhanService } from '../../services/tinNhanService';
import { getImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../../components/ImageWithFallback';
import { toast } from 'react-toastify';
import { formatVietnamDateTimeFull } from '../../utils/dateUtils';

function QuanLyChat() {
  const [khachHangs, setKhachHangs] = useState([]);
  const [selectedKhachHang, setSelectedKhachHang] = useState(null);
  const [tinNhans, setTinNhans] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadDanhSachKhachHang();
    
    // Auto refresh mỗi 5 giây
    const interval = setInterval(() => {
      if (selectedKhachHang) {
        loadTinNhans(selectedKhachHang.nguoiDungId);
      }
      loadDanhSachKhachHang();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedKhachHang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tinNhans]);

  useEffect(() => {
    if (selectedKhachHang && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedKhachHang]);

  const loadDanhSachKhachHang = async () => {
    try {
      const data = await tinNhanService.getDanhSachKhachHang();
      setKhachHangs(data);
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const loadTinNhans = async (khachHangId) => {
    try {
      const data = await tinNhanService.getTinNhanCuaKhachHang(khachHangId);
      setTinNhans(data);
    } catch (error) {
      toast.error('Không thể tải tin nhắn');
    }
  };

  const handleSelectKhachHang = (khachHang) => {
    setSelectedKhachHang(khachHang);
    loadTinNhans(khachHang.nguoiDungId);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedKhachHang) return;

    try {
      await tinNhanService.phanHoiKhachHang(selectedKhachHang.nguoiDungId, inputMessage);
      setInputMessage('');
      loadTinNhans(selectedKhachHang.nguoiDungId);
      loadDanhSachKhachHang();
      toast.success('Đã gửi tin nhắn');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar - Danh sách khách hàng */}
      <div className="w-80 backdrop-blur-xl bg-white/30 border-r border-white/30 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold">💬 Quản lý Chat</h2>
          <p className="text-sm text-blue-100 mt-1">
            {khachHangs.length} khách hàng đang chat
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {khachHangs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có khách hàng nào chat
            </div>
          ) : (
            khachHangs.map((kh) => (
              <div
                key={kh.nguoiDungId}
                onClick={() => handleSelectKhachHang(kh)}
                className={`p-4 border-b border-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-md transition-all duration-300 ${
                  selectedKhachHang?.nguoiDungId === kh.nguoiDungId
                    ? 'bg-white/40 backdrop-blur-md border-l-4 border-l-indigo-600'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {kh.nguoiDung?.hoTen || `${kh.nguoiDung?.ho || ''} ${kh.nguoiDung?.ten || ''}`.trim() || kh.nguoiDung?.email || 'Khách hàng'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {kh.tinNhanCuoiCung?.noiDung || 'Chưa có tin nhắn'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {kh.tinNhanCuoiCung?.ngayGui
                        ? formatVietnamDateTimeFull(kh.tinNhanCuoiCung.ngayGui)
                        : ''}
                    </p>
                  </div>
                  {kh.soTinNhanChuaDoc > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {kh.soTinNhanChuaDoc}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedKhachHang ? (
          <>
            {/* Header */}
            <div className="backdrop-blur-xl bg-white/40 border-b border-white/30 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedKhachHang.nguoiDung?.hoTen || `${selectedKhachHang.nguoiDung?.ho || ''} ${selectedKhachHang.nguoiDung?.ten || ''}`.trim() || selectedKhachHang.nguoiDung?.email || 'Khách hàng'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedKhachHang.nguoiDung?.email}
                    {selectedKhachHang.nguoiDung?.soDienThoai && (
                      <> • {selectedKhachHang.nguoiDung.soDienThoai}</>
                    )}
                  </p>
                </div>
                {selectedKhachHang.soTinNhanChuaDoc > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedKhachHang.soTinNhanChuaDoc} tin nhắn mới
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white/20 to-white/10 space-y-4">
              {tinNhans.map((tn) => (
                <div
                  key={tn.id}
                  className={`flex ${tn.loai === 'User' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2 shadow-lg backdrop-blur-md ${
                      tn.loai === 'User'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-white/30'
                        : tn.loai === 'Human'
                        ? 'bg-white/60 backdrop-blur-md text-green-800 border border-green-200/50'
                        : 'bg-white/60 backdrop-blur-md text-gray-800 border border-white/50'
                    }`}
                  >
                    {/* Hiển thị sản phẩm nếu có */}
                    {tn.sanPham && (
                      <div
                        className={`mb-2 p-3 rounded-lg border ${
                          tn.loai === 'User'
                            ? 'bg-blue-500 border-blue-400'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex space-x-3">
                          <ImageWithFallback
                            src={tn.sanPham.hinhAnhChinh}
                            alt={tn.sanPham.ten}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4
                              className={`font-semibold text-sm ${
                                tn.loai === 'User' ? 'text-white' : 'text-gray-800'
                              }`}
                            >
                              {tn.sanPham.ten}
                            </h4>
                            <p
                              className={`text-sm mt-1 ${
                                tn.loai === 'User' ? 'text-blue-100' : 'text-blue-600'
                              }`}
                            >
                              {formatPrice(tn.sanPham.gia)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="whitespace-pre-line">{tn.noiDung}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {formatVietnamDateTimeFull(tn.ngayGui)}
                    </p>
                    {tn.nguoiPhanHoi && (
                      <p className="text-xs mt-1 opacity-75">
                        Phản hồi bởi: {tn.nguoiPhanHoi.hoTen || tn.nguoiPhanHoi.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="backdrop-blur-xl bg-white/40 border-t border-white/30 p-4 shadow-lg">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn phản hồi..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-xl border border-white/30"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-2xl mb-2">💬</p>
              <p>Chọn khách hàng để bắt đầu chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuanLyChat;

