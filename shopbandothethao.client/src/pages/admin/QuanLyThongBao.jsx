import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { HiOutlineBell, HiOutlineFire, HiOutlineX, HiOutlineCheckCircle, HiOutlinePlus } from 'react-icons/hi';
import { formatVietnamDateTimeFull } from '../../utils/dateUtils';

function QuanLyThongBao() {
  const [thongBao, setThongBao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tieuDe: '',
    noiDung: '',
    loai: 'DealHot',
    sanPhamId: '',
    lienKet: '',
    nguoiDungIds: [],
  });
  const [sanPham, setSanPham] = useState([]);
  const [nguoiDung, setNguoiDung] = useState([]);
  const [filter, setFilter] = useState('all'); // all, DonHang, DealHot, KhuyenMai, CanhBao

  useEffect(() => {
    loadThongBao();
    loadSanPham();
    if (formData.loai === 'CanhBao') {
      loadNguoiDung();
    }
  }, [filter, formData.loai]);

  const loadThongBao = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDanhSachThongBao(filter, 1, 100);
      setThongBao(data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      toast.error('Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const loadSanPham = async () => {
    try {
      const data = await adminService.getDanhSachSanPham();
      setSanPham(data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    }
  };

  const loadNguoiDung = async () => {
    try {
      const data = await adminService.getDanhSachNguoiDung('', 1, 1000);
      setNguoiDung(data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.loai === 'DealHot') {
        await adminService.taoThongBaoDealHot({
          sanPhamId: parseInt(formData.sanPhamId),
          tieuDe: formData.tieuDe,
          noiDung: formData.noiDung,
        });
        toast.success('Tạo thông báo Deal Hot thành công! Đã gửi đến toàn bộ khách hàng.');
      } else if (formData.loai === 'KhuyenMai') {
        await adminService.taoThongBaoKhuyenMai({
          tieuDe: formData.tieuDe,
          noiDung: formData.noiDung,
          lienKet: formData.lienKet || null,
        });
        toast.success('Tạo thông báo Khuyến mãi thành công! Đã gửi đến toàn bộ khách hàng.');
      } else if (formData.loai === 'CanhBao') {
        if (formData.nguoiDungIds.length === 0) {
          toast.error('Vui lòng chọn ít nhất một khách hàng');
          return;
        }
        await adminService.taoThongBaoCanhBao({
          nguoiDungIds: formData.nguoiDungIds,
          tieuDe: formData.tieuDe,
          noiDung: formData.noiDung,
          lienKet: formData.lienKet || null,
        });
        toast.success(`Tạo thông báo Cảnh báo thành công! Đã gửi đến ${formData.nguoiDungIds.length} khách hàng.`);
      }
      setShowModal(false);
      setFormData({ tieuDe: '', noiDung: '', loai: 'DealHot', sanPhamId: '', lienKet: '', nguoiDungIds: [] });
      loadThongBao();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể tạo thông báo');
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
      case 'CanhBao':
        return '⚠️';
      case 'AdminDonHang':
        return '📋';
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
      case 'CanhBao':
        return 'from-yellow-500 to-orange-500';
      case 'AdminDonHang':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineBell className="w-8 h-8 text-pink-600" />
            <span>Quản lý Thông báo</span>
          </h1>
          <button
            onClick={() => {
              setFormData({ tieuDe: '', noiDung: '', loai: 'DealHot', sanPhamId: '', lienKet: '', nguoiDungIds: [] });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Tạo thông báo
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('DonHang')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'DonHang'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Đơn hàng
          </button>
          <button
            onClick={() => setFilter('DealHot')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'DealHot'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Deal Hot
          </button>
          <button
            onClick={() => setFilter('KhuyenMai')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'KhuyenMai'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Khuyến mãi
          </button>
          <button
            onClick={() => setFilter('CanhBao')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'CanhBao'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Cảnh báo
          </button>
          <button
            onClick={() => setFilter('AdminDonHang')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === 'AdminDonHang'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            Thông báo Admin
          </button>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white/40 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl p-6">
        {thongBao.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineBell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {thongBao.map((tb) => (
              <div
                key={tb.id}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-pink-100/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${getLoaiColor(tb.loai)} flex items-center justify-center text-white text-xl`}>
                    {getLoaiIcon(tb.loai)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{tb.tieuDe}</h3>
                    <p className="text-sm text-gray-600 mb-2">{tb.noiDung}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Loại: {tb.loai === 'DealHot' ? 'Deal Hot' : tb.loai === 'KhuyenMai' ? 'Khuyến mãi' : tb.loai === 'CanhBao' ? 'Cảnh báo' : tb.loai === 'DonHang' ? 'Đơn hàng' : tb.loai === 'AdminDonHang' ? 'Thông báo Admin' : tb.loai}</span>
                      <span>Người nhận: {tb.nguoiDung?.hoTen || tb.nguoiDung?.email || 'N/A'}</span>
                      <span>{formatVietnamDateTimeFull(new Date(tb.ngayTao))}</span>
                      {tb.daDoc && <span className="text-green-600">✓ Đã đọc</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo thông báo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <HiOutlineBell className="w-7 h-7 text-pink-600" />
                  <span>Tạo thông báo</span>
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-pink-50 rounded-full transition-all"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-500 hover:text-pink-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Loại thông báo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.loai}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value, sanPhamId: '', nguoiDungIds: [] })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                  >
                    <option value="DealHot">🔥 Deal Hot (Gửi đến toàn bộ khách hàng)</option>
                    <option value="KhuyenMai">🎁 Khuyến mãi/Voucher (Gửi đến toàn bộ khách hàng)</option>
                    <option value="CanhBao">⚠️ Cảnh báo (Gửi riêng cho khách hàng)</option>
                  </select>
                </div>

                {formData.loai === 'DealHot' && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">
                      Sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.sanPhamId}
                      onChange={(e) => setFormData({ ...formData, sanPhamId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                    >
                      <option value="">Chọn sản phẩm</option>
                      {sanPham.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.ten}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.loai === 'CanhBao' && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">
                      Chọn khách hàng <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">({formData.nguoiDungIds.length} đã chọn)</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto border-2 border-pink-100 rounded-xl p-3 bg-white/80 backdrop-blur-sm">
                      {nguoiDung.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Đang tải danh sách khách hàng...</p>
                      ) : (
                        nguoiDung.map((nd) => (
                          <label key={nd.id} className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.nguoiDungIds.includes(nd.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, nguoiDungIds: [...formData.nguoiDungIds, nd.id] });
                                } else {
                                  setFormData({ ...formData, nguoiDungIds: formData.nguoiDungIds.filter(id => id !== nd.id) });
                                }
                              }}
                              className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {nd.ho} {nd.ten} ({nd.email})
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tieuDe}
                    onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                    placeholder="Ví dụ: Deal hot - Giảm 50%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tieuDe}
                    onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                    placeholder={formData.loai === 'DealHot' ? 'Ví dụ: Deal hot - Giảm 50%' : formData.loai === 'KhuyenMai' ? 'Ví dụ: Voucher giảm 20%' : 'Ví dụ: Cảnh báo về đơn hàng'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.noiDung}
                    onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                    rows="4"
                    placeholder={formData.loai === 'DealHot' ? 'Mô tả deal hot...' : formData.loai === 'KhuyenMai' ? 'Mô tả khuyến mãi/voucher...' : 'Nội dung cảnh báo...'}
                  />
                </div>

                {(formData.loai === 'KhuyenMai' || formData.loai === 'CanhBao') && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">
                      Link liên kết (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={formData.lienKet}
                      onChange={(e) => setFormData({ ...formData, lienKet: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                      placeholder="/khuyen-mai hoặc /san-pham/123"
                    />
                  </div>
                )}

                {(formData.loai === 'DealHot' || formData.loai === 'KhuyenMai') && (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                    <p className="text-sm text-blue-700 font-semibold">
                      ℹ️ Thông báo này sẽ được gửi đến <strong>toàn bộ khách hàng</strong> đang hoạt động.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-pink-200 text-gray-700 py-3 rounded-xl hover:bg-pink-50 font-bold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Tạo thông báo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyThongBao;

