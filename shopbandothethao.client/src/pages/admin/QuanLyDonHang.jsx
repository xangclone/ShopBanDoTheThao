import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';

function QuanLyDonHang() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [donHang, setDonHang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trangThai, setTrangThai] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maDonHangSearch, setMaDonHangSearch] = useState('');
  const [showChiTietModal, setShowChiTietModal] = useState(false);
  const [chiTietDonHang, setChiTietDonHang] = useState(null);
  const [loadingChiTiet, setLoadingChiTiet] = useState(false);
  const [showHuyModal, setShowHuyModal] = useState(false);
  const [donHangHuy, setDonHangHuy] = useState(null);
  const [lyDoHuy, setLyDoHuy] = useState('');
  const [lyDoHuyTuChon, setLyDoHuyTuChon] = useState('');

  useEffect(() => {
    loadDonHang();
  }, [trangThai, page]);

  // Kiểm tra query param maDonHang và tự động mở modal
  useEffect(() => {
    const maDonHang = searchParams.get('maDonHang');
    if (maDonHang && !showChiTietModal && !loadingChiTiet) {
      handleTimKiemMaDonHangFromUrl(maDonHang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadDonHang = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachDonHang(trangThai, page, 20);
      setDonHang(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCapNhatTrangThai = async (id, trangThaiMoi, lyDoHuy = null) => {
    try {
      await adminService.capNhatTrangThaiDonHang(id, trangThaiMoi, lyDoHuy);
      toast.success('Cập nhật trạng thái thành công');
      loadDonHang();
      if (showChiTietModal) {
        loadChiTietDonHang(id);
      }
      if (trangThaiMoi === 'DaHuy') {
        setShowHuyModal(false);
        setDonHangHuy(null);
        setLyDoHuy('');
        setLyDoHuyTuChon('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật');
    }
  };

  const handleMoHuyModal = (don) => {
    setDonHangHuy(don);
    setShowHuyModal(true);
    setLyDoHuy('');
    setLyDoHuyTuChon('');
  };

  const handleXacNhanHuy = () => {
    if (!lyDoHuy && !lyDoHuyTuChon.trim()) {
      toast.error('Vui lòng chọn hoặc nhập lý do hủy đơn hàng');
      return;
    }
    const lyDo = lyDoHuy === 'Khac' ? lyDoHuyTuChon.trim() : lyDoHuy;
    handleCapNhatTrangThai(donHangHuy.id, 'DaHuy', lyDo);
  };

  const handleTimKiemMaDonHang = async () => {
    if (!maDonHangSearch.trim()) {
      toast.error('Vui lòng nhập mã đơn hàng');
      return;
    }
    setLoadingChiTiet(true);
    try {
      const data = await adminService.getDonHangByMaDonHang(maDonHangSearch.trim());
      setChiTietDonHang(data);
      setShowChiTietModal(true);
      // Cập nhật URL với maDonHang
      setSearchParams({ maDonHang: maDonHangSearch.trim() });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
    } finally {
      setLoadingChiTiet(false);
    }
  };

  const handleTimKiemMaDonHangFromUrl = async (maDonHang) => {
    setLoadingChiTiet(true);
    try {
      const data = await adminService.getDonHangByMaDonHang(maDonHang);
      setChiTietDonHang(data);
      setShowChiTietModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
      // Xóa query param nếu không tìm thấy
      setSearchParams({});
    } finally {
      setLoadingChiTiet(false);
    }
  };

  const loadChiTietDonHang = async (id) => {
    setLoadingChiTiet(true);
    try {
      const data = await adminService.getDonHangById(id);
      setChiTietDonHang(data);
      setShowChiTietModal(true);
    } catch (error) {
      toast.error('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoadingChiTiet(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getTrangThaiColor = (trangThai) => {
    switch (trangThai) {
      case 'DaGiao': return 'bg-green-100 text-green-800';
      case 'DaHuy': return 'bg-red-100 text-red-800';
      case 'DangGiao': return 'bg-blue-100 text-blue-800';
      case 'DaXacNhan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  const trangThaiMap = {
    ChoXacNhan: 'Chờ xác nhận',
    DaXacNhan: 'Đã xác nhận',
    DangGiao: 'Đang giao',
    DaGiao: 'Đã giao',
    DaHuy: 'Đã hủy',
    HoanTra: 'Hoàn trả',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý đơn hàng
        </h1>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tìm theo mã đơn hàng..."
              value={maDonHangSearch}
              onChange={(e) => setMaDonHangSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTimKiemMaDonHang()}
              className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleTimKiemMaDonHang}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
            >
              Tìm kiếm
            </button>
          </div>
          <select
            value={trangThai}
            onChange={(e) => {
              setTrangThai(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ChoXacNhan">Chờ xác nhận</option>
            <option value="DaXacNhan">Đã xác nhận</option>
            <option value="DangGiao">Đang giao</option>
            <option value="DaGiao">Đã giao</option>
            <option value="DaHuy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        <table className="w-full">
          <thead className="backdrop-blur-md bg-white/50">
            <tr>
              <th className="px-4 py-3 text-left">Mã đơn</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Ngày đặt</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3 text-left">Ghi chú</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="backdrop-blur-sm bg-white/20">
            {donHang.map((don) => (
              <tr key={don.id} className="border-b border-white/30 hover:bg-white/40 transition-all duration-300">
                <td className="px-4 py-3">
                  <button
                    onClick={() => loadChiTietDonHang(don.id)}
                    className="backdrop-blur-md bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 px-3 py-1 rounded-lg border border-blue-300/30 transition-all duration-300 font-medium"
                  >
                    {don.maDonHang}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {don.nguoiDung?.ho} {don.nguoiDung?.ten}
                  <br />
                  <span className="text-sm text-gray-500">{don.nguoiDung?.email}</span>
                </td>
                <td className="px-4 py-3">{formatDate(don.ngayDat)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-sm ${getTrangThaiColor(don.trangThai)}`}>
                    {trangThaiMap[don.trangThai] || don.trangThai}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(don.tongTien)}</td>
                <td className="px-4 py-3">
                  {don.ghiChu ? (
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-700 line-clamp-2" title={don.ghiChu}>
                        {don.ghiChu}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Không có</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    {don.trangThai === 'ChoXacNhan' && (
                      <button
                        onClick={() => handleCapNhatTrangThai(don.id, 'DaXacNhan')}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm font-semibold shadow-lg border border-white/30 transition-all duration-300"
                      >
                        Xác nhận
                      </button>
                    )}
                    {don.trangThai === 'DaXacNhan' && (
                      <button
                        onClick={() => handleCapNhatTrangThai(don.id, 'DangGiao')}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                      >
                        Đang giao
                      </button>
                    )}
                    {don.trangThai === 'DangGiao' && (
                      <button
                        onClick={() => handleCapNhatTrangThai(don.id, 'DaGiao')}
                        className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold shadow-lg border border-white/30 transition-all duration-300"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {(don.trangThai === 'ChoXacNhan' || 
                      don.trangThai === 'DaXacNhan' || 
                      don.trangThai === 'DangGiao') && (
                      <button
                        onClick={() => handleMoHuyModal(don)}
                        className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 text-sm font-semibold shadow-lg border border-white/30 transition-all duration-300"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md disabled:opacity-50 hover:bg-white/40 transition-all duration-300 font-medium"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md disabled:opacity-50 hover:bg-white/40 transition-all duration-300 font-medium"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal Chi tiết đơn hàng */}
      {showChiTietModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
                <button
                  onClick={() => {
                    setShowChiTietModal(false);
                    setChiTietDonHang(null);
                    // Xóa query param khi đóng modal
                    setSearchParams({});
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {loadingChiTiet ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : chiTietDonHang ? (
                <div className="space-y-6">
                  {/* Thông tin đơn hàng */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Mã đơn hàng</h3>
                      <p className="text-gray-600">{chiTietDonHang.maDonHang}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ngày đặt</h3>
                      <p className="text-gray-600">{formatDate(chiTietDonHang.ngayDat)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Trạng thái</h3>
                      <span className={`px-2 py-1 rounded text-sm ${getTrangThaiColor(chiTietDonHang.trangThai)}`}>
                        {trangThaiMap[chiTietDonHang.trangThai] || chiTietDonHang.trangThai}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Trạng thái thanh toán</h3>
                      <p className="text-gray-600">{chiTietDonHang.trangThaiThanhToan}</p>
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="border-t border-white/30 pt-4">
                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                    <p className="text-gray-600">
                      {chiTietDonHang.nguoiDung?.ho} {chiTietDonHang.nguoiDung?.ten}
                    </p>
                    <p className="text-gray-600">{chiTietDonHang.nguoiDung?.email}</p>
                    {chiTietDonHang.nguoiDung?.soDienThoai && (
                      <p className="text-gray-600">{chiTietDonHang.nguoiDung.soDienThoai}</p>
                    )}
                  </div>

                  {/* Địa chỉ giao hàng */}
                  {chiTietDonHang.diaChiGiaoHang && (
                    <div className="border-t border-white/30 pt-4">
                      <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
                      <p className="text-gray-600">
                        {chiTietDonHang.diaChiGiaoHang.tenNguoiNhan} - {chiTietDonHang.diaChiGiaoHang.soDienThoaiNhan}
                      </p>
                      <p className="text-gray-600">
                        {chiTietDonHang.diaChiGiaoHang.duongPho}, {chiTietDonHang.diaChiGiaoHang.phuongXa}, {chiTietDonHang.diaChiGiaoHang.quanHuyen}, {chiTietDonHang.diaChiGiaoHang.thanhPho}
                      </p>
                    </div>
                  )}

                  {/* Sản phẩm */}
                  <div className="border-t border-white/30 pt-4">
                    <h3 className="font-semibold mb-4">Sản phẩm</h3>
                    <div className="space-y-4">
                      {chiTietDonHang.danhSachChiTiet?.map((ct) => (
                        <div key={ct.id} className="flex items-center gap-4 border-b border-white/30 pb-4 backdrop-blur-sm bg-white/20 rounded-xl p-4">
                          <img
                            src={ct.sanPham?.hinhAnhChinh 
                              ? (ct.sanPham.hinhAnhChinh.startsWith('http') 
                                  ? ct.sanPham.hinhAnhChinh 
                                  : ct.sanPham.hinhAnhChinh.startsWith('/')
                                  ? `http://localhost:5066${ct.sanPham.hinhAnhChinh}`
                                  : `http://localhost:5066/uploads/${ct.sanPham.hinhAnhChinh}`)
                              : '/placeholder.jpg'}
                            alt={ct.sanPham?.ten}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-grow">
                            <h4 className="font-semibold">{ct.sanPham?.ten}</h4>
                            <p className="text-sm text-gray-600">SKU: {ct.sanPham?.sku || 'N/A'}</p>
                            <p className="text-sm text-gray-600">
                              Số lượng: {ct.soLuong} x {formatPrice(ct.gia)}
                            </p>
                            {ct.kichThuoc && <p className="text-sm text-gray-600">Size: {ct.kichThuoc}</p>}
                            {ct.mauSac && <p className="text-sm text-gray-600">Màu: {ct.mauSac}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(ct.thanhTien)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tóm tắt thanh toán */}
                  <div className="border-t border-white/30 pt-4">
                    <h3 className="font-semibold mb-4">Tóm tắt thanh toán</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(chiTietDonHang.tongTienSanPham)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>{formatPrice(chiTietDonHang.phiVanChuyen)}</span>
                      </div>
                      {chiTietDonHang.giamGia > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>-{formatPrice(chiTietDonHang.giamGia)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Thuế VAT:</span>
                        <span>{formatPrice(chiTietDonHang.thue)}</span>
                      </div>
                      <div className="border-t border-white/30 pt-2 flex justify-between font-bold text-lg">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">{formatPrice(chiTietDonHang.tongTien)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ghi chú */}
                  {chiTietDonHang.ghiChu && (
                    <div className="border-t border-white/30 pt-4">
                      <h3 className="font-semibold mb-2">Ghi chú</h3>
                      <p className="text-gray-600">{chiTietDonHang.ghiChu}</p>
                    </div>
                  )}

                  {/* Lý do hủy (nếu đơn hàng đã bị hủy) */}
                  {chiTietDonHang.trangThai === 'DaHuy' && chiTietDonHang.lyDoHoanTra && (
                    <div className="border-t border-white/30 pt-4">
                      <h3 className="font-semibold mb-2 text-red-600">Lý do hủy đơn hàng</h3>
                      <div className="bg-red-50/60 backdrop-blur-md rounded-xl p-4 border border-red-200/50">
                        <p className="text-gray-700 whitespace-pre-wrap">{chiTietDonHang.lyDoHoanTra}</p>
                      </div>
                    </div>
                  )}

                  {/* Cập nhật trạng thái */}
                  <div className="border-t border-white/30 pt-4">
                    <h3 className="font-semibold mb-4">Cập nhật trạng thái</h3>
                    <div className="flex gap-2 flex-wrap">
                      {chiTietDonHang.trangThai === 'ChoXacNhan' && (
                        <button
                          onClick={() => handleCapNhatTrangThai(chiTietDonHang.id, 'DaXacNhan')}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                        >
                          Xác nhận đơn hàng
                        </button>
                      )}
                      {chiTietDonHang.trangThai === 'DaXacNhan' && (
                        <button
                          onClick={() => handleCapNhatTrangThai(chiTietDonHang.id, 'DangGiao')}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                        >
                          Bắt đầu giao hàng
                        </button>
                      )}
                      {chiTietDonHang.trangThai === 'DangGiao' && (
                        <button
                          onClick={() => handleCapNhatTrangThai(chiTietDonHang.id, 'DaGiao')}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                        >
                          Hoàn thành giao hàng
                        </button>
                      )}
                      {(chiTietDonHang.trangThai === 'ChoXacNhan' || 
                        chiTietDonHang.trangThai === 'DaXacNhan' || 
                        chiTietDonHang.trangThai === 'DangGiao') && (
                        <button
                          onClick={() => handleMoHuyModal(chiTietDonHang)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Hủy đơn hàng */}
      {showHuyModal && donHangHuy && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">Hủy đơn hàng</h2>
                <button
                  onClick={() => {
                    setShowHuyModal(false);
                    setDonHangHuy(null);
                    setLyDoHuy('');
                    setLyDoHuyTuChon('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Mã đơn hàng:</span> {donHangHuy.maDonHang}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lý do hủy đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={lyDoHuy}
                    onChange={(e) => setLyDoHuy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/60 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="KhachHangYeuCau">Khách hàng yêu cầu hủy</option>
                    <option value="HetHang">Hết hàng</option>
                    <option value="KhongLienLacDuoc">Không liên lạc được với khách hàng</option>
                    <option value="DiaChiKhongHopLe">Địa chỉ giao hàng không hợp lệ</option>
                    <option value="LoiHeThong">Lỗi hệ thống</option>
                    <option value="Khac">Lý do khác</option>
                  </select>
                </div>

                {lyDoHuy === 'Khac' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nhập lý do <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={lyDoHuyTuChon}
                      onChange={(e) => setLyDoHuyTuChon(e.target.value)}
                      placeholder="Nhập lý do hủy đơn hàng..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/60 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowHuyModal(false);
                      setDonHangHuy(null);
                      setLyDoHuy('');
                      setLyDoHuyTuChon('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleXacNhanHuy}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 font-semibold shadow-xl border border-white/30 transition-all duration-300"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyDonHang;

