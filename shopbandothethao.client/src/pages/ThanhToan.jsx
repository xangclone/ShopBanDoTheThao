import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gioHangService } from '../services/gioHangService';
import { donHangService } from '../services/donHangService';
import { diaChiService } from '../services/diaChiService';
import { authService } from '../services/authService';
import { maGiamGiaService } from '../services/maGiamGiaService';
import { toast } from 'react-toastify';
import { 
  HiOutlineCreditCard, 
  HiOutlineLocationMarker, 
  HiOutlineGift, 
  HiOutlineDocumentText, 
  HiOutlineShoppingBag,
  HiOutlineCheckCircle,
  HiOutlinePlus
} from 'react-icons/hi';

function ThanhToan() {
  const navigate = useNavigate();
  const [gioHang, setGioHang] = useState([]);
  const [diaChi, setDiaChi] = useState([]);
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    diaChiGiaoHangId: '',
    phuongThucThanhToanId: '',
    maGiamGia: '',
    phuongThucGiaoHang: 'Nhanh',
    ghiChu: '',
  });
  const [maGiamGiaInfo, setMaGiamGiaInfo] = useState(null); // Thông tin mã giảm giá đã áp dụng
  const [giamGia, setGiamGia] = useState(0); // Số tiền giảm giá

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/dang-nhap');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [cart, addresses] = await Promise.all([
        gioHangService.getGioHang(),
        diaChiService.getDanhSach(),
      ]);
      
      console.log('Giỏ hàng loaded:', cart);
      console.log('Số lượng sản phẩm trong giỏ:', cart?.length || 0);
      
      if (!cart || cart.length === 0) {
        toast.warning('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
        navigate('/gio-hang');
        return;
      }
      
      // Kiểm tra xem có sản phẩm đã chọn từ giỏ hàng không
      const selectedCartItemIds = sessionStorage.getItem('selectedCartItems');
      if (selectedCartItemIds) {
        try {
          const selectedIds = JSON.parse(selectedCartItemIds);
          // Chỉ lấy các sản phẩm đã được chọn
          const selectedItems = cart.filter(item => selectedIds.includes(item.id));
          if (selectedItems.length > 0) {
            setGioHang(selectedItems);
            // Xóa sessionStorage sau khi đã sử dụng
            sessionStorage.removeItem('selectedCartItems');
          } else {
            setGioHang(cart);
          }
        } catch (e) {
          // Nếu có lỗi parse, dùng toàn bộ giỏ hàng
          setGioHang(cart);
        }
      } else {
        setGioHang(cart);
      }
      
      setDiaChi(addresses);
      setPhuongThucThanhToan([]); // TODO: Load payment methods when API is ready
      
      // Tự động chọn địa chỉ mặc định nếu có
      const diaChiMacDinh = addresses.find(dc => dc.macDinh);
      if (diaChiMacDinh) {
        setFormData(prev => ({
          ...prev,
          diaChiGiaoHangId: diaChiMacDinh.id.toString()
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const tongTienSanPham = gioHang.reduce(
    (sum, item) => sum + item.sanPham.gia * item.soLuong,
    0
  );

  const phiVanChuyen = 30000;
  const thue = (tongTienSanPham - giamGia) * 0.1;
  const tongTien = tongTienSanPham - giamGia + phiVanChuyen + thue;

  // Hàm xử lý áp dụng mã giảm giá
  const handleApDungMaGiamGia = async () => {
    const maCode = formData.maGiamGia.trim();
    if (!maCode) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      const result = await maGiamGiaService.kiemTra(maCode, tongTienSanPham);
      
      if (result.valid) {
        setGiamGia(result.maGiamGia.giamGia || 0);
        setMaGiamGiaInfo({
          ma: result.maGiamGia.ma,
          loaiGiamGia: result.maGiamGia.loaiGiamGia,
          giamGia: result.maGiamGia.giamGia
        });
        toast.success('Áp dụng mã giảm giá thành công!');
      } else {
        toast.error(result.message || 'Mã giảm giá không hợp lệ');
        setMaGiamGiaInfo(null);
        setGiamGia(0);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra mã giảm giá:', error);
      const errorMessage = error.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
      toast.error(errorMessage);
      setMaGiamGiaInfo(null);
      setGiamGia(0);
    }
  };

  // Hàm xóa mã giảm giá
  const handleXoaMaGiamGia = () => {
    setFormData({ ...formData, maGiamGia: '' });
    setMaGiamGiaInfo(null);
    setGiamGia(0);
    toast.info('Đã xóa mã giảm giá');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gioHang || gioHang.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
      navigate('/gio-hang');
      return;
    }
    
    if (!formData.diaChiGiaoHangId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    try {
      const diaChiId = parseInt(formData.diaChiGiaoHangId);
      if (isNaN(diaChiId) || diaChiId <= 0) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        return;
      }

      const dataToSend = {
        diaChiGiaoHangId: diaChiId,
        phuongThucThanhToanId: formData.phuongThucThanhToanId && 
                               formData.phuongThucThanhToanId !== 'COD' && 
                               formData.phuongThucThanhToanId !== 'BANK' 
          ? parseInt(formData.phuongThucThanhToanId) 
          : null,
        maGiamGia: formData.maGiamGia && formData.maGiamGia.trim() !== '' ? formData.maGiamGia.trim() : null,
        phiVanChuyen: phiVanChuyen,
        phuongThucGiaoHang: formData.phuongThucGiaoHang && formData.phuongThucGiaoHang.trim() !== '' 
          ? formData.phuongThucGiaoHang.trim() 
          : null,
        ghiChu: formData.ghiChu && formData.ghiChu.trim() !== '' ? formData.ghiChu.trim() : null,
      };
      
      console.log('Gửi dữ liệu đơn hàng:', dataToSend);
      
      const donHang = await donHangService.taoDonHang(dataToSend);
      toast.success('Đặt hàng thành công!');
      navigate(`/don-hang/${donHang.id}`);
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      console.error('Response data:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors ? error.response.data.errors.join(', ') : '') ||
                          error.message || 
                          'Đặt hàng thất bại';
      toast.error(errorMessage);
    }
  };

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
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Giỏ hàng trống
          </h2>
          <button
            onClick={() => navigate('/san-pham')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <HiOutlineCreditCard className="w-10 h-10 text-pink-600" />
          <span>Thanh toán</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Địa chỉ giao hàng */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                <HiOutlineLocationMarker className="w-7 h-7 text-pink-600" />
                <span>Địa chỉ giao hàng</span>
              </h2>
            {loading ? (
              <p className="text-gray-500 font-medium">Đang tải địa chỉ...</p>
            ) : diaChi.length === 0 ? (
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
                <p className="text-gray-600 mb-4 font-medium">Chưa có địa chỉ. Vui lòng thêm địa chỉ mới.</p>
                <button
                  type="button"
                  onClick={() => navigate('/them-dia-chi')}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <HiOutlinePlus className="w-5 h-5" />
                  Thêm địa chỉ mới
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {diaChi.map((dc) => (
                  <label key={dc.id} className={`flex items-start space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    formData.diaChiGiaoHangId === dc.id.toString()
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400 shadow-lg'
                      : 'bg-white/60 backdrop-blur-sm border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                  }`}>
                    <input
                      type="radio"
                      name="diaChi"
                      value={dc.id}
                      checked={formData.diaChiGiaoHangId === dc.id.toString()}
                      onChange={(e) => setFormData({ ...formData, diaChiGiaoHangId: e.target.value })}
                      className="mt-1 w-5 h-5 text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-800">{dc.tenNguoiNhan}</p>
                        {dc.macDinh && (
                          <span className="text-xs bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-1 rounded-full font-bold shadow-md">⭐ Mặc định</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        {dc.duongPho}
                        {dc.phuongXa && `, ${dc.phuongXa}`}
                        {dc.quanHuyen && `, ${dc.quanHuyen}`}
                        {`, ${dc.thanhPho}`}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">📱 {dc.soDienThoaiNhan}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {diaChi.length > 0 && (
              <button
                type="button"
                onClick={() => navigate('/them-dia-chi')}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ➕ Thêm địa chỉ mới
              </button>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              <HiOutlineCreditCard className="w-7 h-7 text-pink-600" />
              <span>Phương thức thanh toán</span>
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                formData.phuongThucThanhToanId === 'COD'
                  ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400 shadow-lg'
                  : 'bg-white/60 backdrop-blur-sm border-pink-100 hover:border-pink-300 hover:bg-pink-50'
              }`}>
                <input
                  type="radio"
                  name="phuongThuc"
                  value="COD"
                  checked={formData.phuongThucThanhToanId === 'COD'}
                  onChange={() => setFormData({ ...formData, phuongThucThanhToanId: 'COD' })}
                  className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                />
                <span className="font-semibold text-gray-800">💰 Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className={`flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                formData.phuongThucThanhToanId === 'BANK'
                  ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400 shadow-lg'
                  : 'bg-white/60 backdrop-blur-sm border-pink-100 hover:border-pink-300 hover:bg-pink-50'
              }`}>
                <input
                  type="radio"
                  name="phuongThuc"
                  value="BANK"
                  checked={formData.phuongThucThanhToanId === 'BANK'}
                  onChange={() => setFormData({ ...formData, phuongThucThanhToanId: 'BANK' })}
                  className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                />
                <span className="font-semibold text-gray-800">🏦 Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>

          {/* Mã giảm giá */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              <HiOutlineGift className="w-7 h-7 text-pink-600" />
              <span>Mã giảm giá</span>
            </h2>
            {maGiamGiaInfo ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-2xl shadow-lg">
                  <div>
                    <p className="font-bold text-emerald-800 text-lg">Mã: {maGiamGiaInfo.ma}</p>
                    <p className="text-sm text-emerald-700 font-semibold">Giảm: {formatPrice(maGiamGiaInfo.giamGia)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleXoaMaGiamGia}
                    className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={formData.maGiamGia}
                  onChange={(e) => setFormData({ ...formData, maGiamGia: e.target.value })}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApDungMaGiamGia();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleApDungMaGiamGia}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>

          {/* Ghi chú */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              <HiOutlineDocumentText className="w-7 h-7 text-pink-600" />
              <span>Ghi chú đơn hàng</span>
            </h2>
            <textarea
              value={formData.ghiChu}
              onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
              placeholder="Ghi chú cho đơn hàng (tùy chọn)"
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              rows="4"
            />
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6 sticky top-24">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              <HiOutlineShoppingBag className="w-7 h-7 text-pink-600" />
              <span>Tóm tắt đơn hàng</span>
            </h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {gioHang.map((item) => (
                <div key={item.id} className="flex justify-between text-sm p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100">
                  <span className="font-medium text-gray-700">{item.sanPham.ten} x {item.soLuong}</span>
                  <span className="font-bold text-pink-600">{formatPrice(item.sanPham.gia * item.soLuong)}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-pink-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Tạm tính:</span>
                <span>{formatPrice(tongTienSanPham)}</span>
              </div>
              {giamGia > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(giamGia)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(phiVanChuyen)}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-medium">
                <span>Thuế VAT (10%):</span>
                <span>{formatPrice(thue)}</span>
              </div>
              <div className="border-t-2 border-pink-200 pt-4 flex justify-between font-bold text-xl">
                <span className="text-gray-800">Tổng cộng:</span>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-2xl">
                  {formatPrice(tongTien)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mt-6"
            >
              <HiOutlineCheckCircle className="w-5 h-5" />
              Đặt hàng
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}

export default ThanhToan;

