import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donHangService } from '../services/donHangService';
import { danhGiaService } from '../services/danhGiaService';
import DanhGiaModal from '../components/DanhGiaModal';
import { toast } from 'react-toastify';
import { formatVietnamDateTimeFull } from '../utils/dateUtils';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';

function ChiTietDonHang() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donHang, setDonHang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [danhGiaModal, setDanhGiaModal] = useState({ isOpen: false, sanPham: null });
  const [daDanhGia, setDaDanhGia] = useState({}); // { sanPhamId: true/false }
  const [hoanTraModal, setHoanTraModal] = useState({ isOpen: false, lyDo: '' });
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, maVanDon: '', viTriHienTai: '', phuongThucGiaoHang: '' });

  useEffect(() => {
    loadDonHang();
  }, [id]);

  const loadDonHang = async () => {
    try {
      const data = await donHangService.getById(id);
      setDonHang(data);
      
      // Kiểm tra sản phẩm nào đã được đánh giá
      if (data.trangThai === 'DaGiao' && data.danhSachChiTiet) {
        const danhGiaMap = {};
        for (const ct of data.danhSachChiTiet) {
          try {
            const danhGias = await danhGiaService.getDanhGiaBySanPham(ct.sanPham.id);
            // Kiểm tra xem user hiện tại đã đánh giá chưa
            // TODO: Cần lấy userId từ authService để kiểm tra chính xác
            danhGiaMap[ct.sanPham.id] = false; // Tạm thời để false, sẽ cải thiện sau
          } catch (error) {
            danhGiaMap[ct.sanPham.id] = false;
          }
        }
        setDaDanhGia(danhGiaMap);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin đơn hàng');
      navigate('/don-hang');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDanhGia = (sanPham) => {
    setDanhGiaModal({ isOpen: true, sanPham });
  };

  const handleDanhGiaSuccess = () => {
    if (danhGiaModal.sanPham) {
      setDaDanhGia(prev => ({
        ...prev,
        [danhGiaModal.sanPham.id]: true
      }));
    }
  };

  const handleHuyDon = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      await donHangService.huyDonHang(id);
      toast.success('Đã hủy đơn hàng');
      loadDonHang();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const handleHoanTra = async () => {
    if (!hoanTraModal.lyDo.trim()) {
      toast.error('Vui lòng nhập lý do hoàn trả');
      return;
    }

    try {
      await donHangService.hoanTraDonHang(id, hoanTraModal.lyDo);
      toast.success('Yêu cầu hoàn trả đã được gửi thành công');
      setHoanTraModal({ isOpen: false, lyDo: '' });
      loadDonHang();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi yêu cầu hoàn trả');
    }
  };

  const handleCapNhatTracking = async () => {
    try {
      await donHangService.capNhatTracking(id, {
        maVanDon: trackingModal.maVanDon || undefined,
        viTriHienTai: trackingModal.viTriHienTai || undefined,
        phuongThucGiaoHang: trackingModal.phuongThucGiaoHang || undefined,
      });
      toast.success('Cập nhật tracking thành công');
      setTrackingModal({ isOpen: false, maVanDon: '', viTriHienTai: '', phuongThucGiaoHang: '' });
      loadDonHang();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật tracking');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return formatVietnamDateTimeFull(date);
  };

  const getTrangThaiColor = (trangThai) => {
    switch (trangThai) {
      case 'DaGiao':
        return 'bg-green-100 text-green-800';
      case 'DaHuy':
        return 'bg-red-100 text-red-800';
      case 'HoanTra':
        return 'bg-orange-100 text-orange-800';
      case 'DangGiao':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      'ChoXacNhan': 'Chờ xác nhận',
      'DaXacNhan': 'Đã xác nhận',
      'DangGiao': 'Đang giao',
      'DaGiao': 'Đã giao',
      'DaHuy': 'Đã hủy',
      'HoanTra': 'Hoàn trả'
    };
    return labels[trangThai] || trangThai;
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (!donHang) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
        <button
          onClick={() => navigate('/don-hang')}
          className="text-blue-600 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Mã đơn hàng</h3>
            <p className="text-gray-600">{donHang.maDonHang}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ngày đặt</h3>
            <p className="text-gray-600">{formatDate(donHang.ngayDat)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Trạng thái</h3>
            <span className={`px-3 py-1 rounded ${getTrangThaiColor(donHang.trangThai)}`}>
              {getTrangThaiLabel(donHang.trangThai)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Trạng thái thanh toán</h3>
            <p className="text-gray-600">{donHang.trangThaiThanhToan}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {(donHang.trangThai === 'ChoXacNhan' || donHang.trangThai === 'DaXacNhan') && (
            <button
              onClick={handleHuyDon}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Hủy đơn hàng
            </button>
          )}
          {donHang.trangThai === 'DaGiao' && (
            <button
              onClick={() => setHoanTraModal({ isOpen: true, lyDo: '' })}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Yêu cầu hoàn trả
            </button>
          )}
          {(donHang.trangThai === 'DangGiao' || donHang.trangThai === 'DaGiao') && (
            <button
              onClick={() => setTrackingModal({ 
                isOpen: true, 
                maVanDon: donHang.maVanDon || '', 
                viTriHienTai: donHang.viTriHienTai || '',
                phuongThucGiaoHang: donHang.phuongThucGiaoHang || ''
              })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Cập nhật tracking
            </button>
          )}
        </div>
      </div>

      {/* Tracking Information */}
      {(donHang.maVanDon || donHang.viTriHienTai) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Thông tin vận chuyển</h2>
          <div className="space-y-3">
            {donHang.maVanDon && (
              <div>
                <h3 className="font-semibold mb-1">Mã vận đơn:</h3>
                <p className="text-gray-600">{donHang.maVanDon}</p>
              </div>
            )}
            {donHang.phuongThucGiaoHang && (
              <div>
                <h3 className="font-semibold mb-1">Phương thức giao hàng:</h3>
                <p className="text-gray-600">{donHang.phuongThucGiaoHang}</p>
              </div>
            )}
            {donHang.viTriHienTai && (
              <div>
                <h3 className="font-semibold mb-1">Vị trí hiện tại:</h3>
                <p className="text-gray-600">{donHang.viTriHienTai}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lý do hoàn trả */}
      {donHang.trangThai === 'HoanTra' && donHang.lyDoHoanTra && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2 text-orange-800">Lý do hoàn trả</h2>
          <p className="text-orange-700">{donHang.lyDoHoanTra}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
        {donHang.diaChiGiaoHang && (
          <div>
            <p className="font-semibold">{donHang.diaChiGiaoHang.tenNguoiNhan}</p>
            <p className="text-gray-600">
              {donHang.diaChiGiaoHang.duongPho}, {donHang.diaChiGiaoHang.phuongXa}, 
              {donHang.diaChiGiaoHang.quanHuyen}, {donHang.diaChiGiaoHang.thanhPho}
            </p>
            <p className="text-gray-600">{donHang.diaChiGiaoHang.soDienThoaiNhan}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
        <div className="space-y-4">
          {donHang.danhSachChiTiet?.map((ct) => (
            <div key={ct.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
              <ImageWithFallback
                src={ct.sanPham?.hinhAnhChinh}
                alt={ct.sanPham?.ten}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{ct.sanPham?.ten}</h3>
                <p className="text-sm text-gray-600">
                  Số lượng: {ct.soLuong} x {formatPrice(ct.gia)}
                </p>
                {ct.kichThuoc && <p className="text-sm text-gray-600">Size: {ct.kichThuoc}</p>}
                {ct.mauSac && <p className="text-sm text-gray-600">Màu: {ct.mauSac}</p>}
                {donHang.trangThai === 'DaGiao' && !daDanhGia[ct.sanPham?.id] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDanhGia(ct.sanPham);
                    }}
                    className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Đánh giá sản phẩm
                  </button>
                )}
                {donHang.trangThai === 'DaGiao' && daDanhGia[ct.sanPham?.id] && (
                  <p className="mt-2 text-sm text-green-600">✓ Đã đánh giá</p>
                )}
              </div>
              <p className="font-bold">{formatPrice(ct.thanhTien)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Tóm tắt thanh toán</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{formatPrice(donHang.tongTienSanPham)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{formatPrice(donHang.phiVanChuyen)}</span>
          </div>
          {donHang.giamGia > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>-{formatPrice(donHang.giamGia)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Thuế VAT:</span>
            <span>{formatPrice(donHang.thue)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{formatPrice(donHang.tongTien)}</span>
          </div>
        </div>
      </div>

      {/* Modal đánh giá */}
      <DanhGiaModal
        isOpen={danhGiaModal.isOpen}
        onClose={() => setDanhGiaModal({ isOpen: false, sanPham: null })}
        sanPham={danhGiaModal.sanPham}
        onSuccess={handleDanhGiaSuccess}
      />

      {/* Modal hoàn trả */}
      {hoanTraModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Yêu cầu hoàn trả</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Lý do hoàn trả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={hoanTraModal.lyDo}
                  onChange={(e) => setHoanTraModal({ ...hoanTraModal, lyDo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="4"
                  placeholder="Vui lòng nhập lý do hoàn trả..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setHoanTraModal({ isOpen: false, lyDo: '' })}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleHoanTra}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal cập nhật tracking */}
      {trackingModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Cập nhật tracking</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mã vận đơn</label>
                  <input
                    type="text"
                    value={trackingModal.maVanDon}
                    onChange={(e) => setTrackingModal({ ...trackingModal, maVanDon: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã vận đơn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vị trí hiện tại</label>
                  <input
                    type="text"
                    value={trackingModal.viTriHienTai}
                    onChange={(e) => setTrackingModal({ ...trackingModal, viTriHienTai: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Đang vận chuyển từ kho Hà Nội"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phương thức giao hàng</label>
                  <input
                    type="text"
                    value={trackingModal.phuongThucGiaoHang}
                    onChange={(e) => setTrackingModal({ ...trackingModal, phuongThucGiaoHang: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Giao hàng nhanh"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setTrackingModal({ isOpen: false, maVanDon: '', viTriHienTai: '', phuongThucGiaoHang: '' })}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCapNhatTracking}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChiTietDonHang;

