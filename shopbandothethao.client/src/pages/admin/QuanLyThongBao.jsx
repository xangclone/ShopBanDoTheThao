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
  });
  const [sanPham, setSanPham] = useState([]);
  const [filter, setFilter] = useState('all'); // all, DonHang, DealHot, KhuyenMai

  useEffect(() => {
    loadThongBao();
    loadSanPham();
  }, [filter]);

  const loadThongBao = async () => {
    setLoading(true);
    try {
      // TODO: Implement admin API to get all notifications
      // const data = await adminService.getDanhSachThongBao(filter);
      // setThongBao(data);
      setThongBao([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.taoThongBaoDealHot({
        sanPhamId: parseInt(formData.sanPhamId),
        tieuDe: formData.tieuDe,
        noiDung: formData.noiDung,
      });
      toast.success('Tạo thông báo thành công!');
      setShowModal(false);
      setFormData({ tieuDe: '', noiDung: '', loai: 'DealHot', sanPhamId: '' });
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Tạo thông báo Deal Hot
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
                      <span>Loại: {tb.loai}</span>
                      <span>Người nhận: {tb.nguoiDungId}</span>
                      <span>{formatVietnamDateTimeFull(new Date(tb.ngayTao))}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal tạo thông báo Deal Hot */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <HiOutlineFire className="w-7 h-7 text-red-600" />
                  <span>Tạo thông báo Deal Hot</span>
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
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.noiDung}
                    onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                    rows="4"
                    placeholder="Mô tả deal hot..."
                  />
                </div>

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

