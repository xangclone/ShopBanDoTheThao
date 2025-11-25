import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { diaChiService } from '../services/diaChiService';
import { toast } from 'react-toastify';
import { 
  HiOutlineUser, 
  HiOutlineLocationMarker, 
  HiOutlineCreditCard, 
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineStar
} from 'react-icons/hi';

function TaiKhoan() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'thongtin');

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      toast.error('Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <HiOutlineUser className="w-10 h-10 text-pink-600" />
          <span>Tài khoản của tôi</span>
        </h1>
        
        <div className="flex flex-wrap gap-3 mb-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 border-pink-100/50 p-4">
          <button
            onClick={() => setActiveTab('thongtin')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              activeTab === 'thongtin'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <HiOutlineDocumentText className="w-5 h-5" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('diachi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              activeTab === 'diachi'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <HiOutlineLocationMarker className="w-5 h-5" />
            Địa chỉ
          </button>
          <button
            onClick={() => setActiveTab('thanhtoan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              activeTab === 'thanhtoan'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <HiOutlineCreditCard className="w-5 h-5" />
            Phương thức thanh toán
          </button>
        </div>

      {activeTab === 'thongtin' && <ThongTinCaNhan user={user} onUpdate={loadUserInfo} />}
      {activeTab === 'diachi' && <QuanLyDiaChi />}
      {activeTab === 'thanhtoan' && <QuanLyThanhToan />}
      </div>
    </div>
  );
}

function ThongTinCaNhan({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    ho: user?.ho || '',
    ten: user?.ten || '',
    soDienThoai: user?.soDienThoai || '',
    ngaySinh: user?.ngaySinh || '',
    gioiTinh: user?.gioiTinh || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement update user API
    toast.success('Cập nhật thông tin thành công!');
    onUpdate();
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
      <h2 className="flex items-center gap-3 text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        <HiOutlineDocumentText className="w-8 h-8 text-pink-600" />
        <span>Thông tin cá nhân</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-3 font-bold text-gray-700">
              <HiOutlineUser className="w-5 h-5 text-pink-600" />
              <span>Họ</span>
            </label>
            <input
              type="text"
              value={formData.ho}
              onChange={(e) => setFormData({ ...formData, ho: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 mb-3 font-bold text-gray-700">
              <HiOutlineUser className="w-5 h-5 text-pink-600" />
              <span>Tên</span>
            </label>
            <input
              type="text"
              value={formData.ten}
              onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
            />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 mb-3 font-bold text-gray-700">
            <HiOutlineMail className="w-5 h-5 text-pink-600" />
            <span>Email</span>
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 mb-3 font-bold text-gray-700">
            <HiOutlinePhone className="w-5 h-5 text-pink-600" />
            <span>Số điện thoại</span>
          </label>
          <input
            type="tel"
            value={formData.soDienThoai}
            onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
            className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-3 font-bold text-gray-700">
              <HiOutlineCalendar className="w-5 h-5 text-pink-600" />
              <span>Ngày sinh</span>
            </label>
            <input
              type="date"
              value={formData.ngaySinh}
              onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
            />
          </div>
          <div>
            <label className="block mb-3 font-bold text-gray-700">⚧️ Giới tính</label>
            <select
              value={formData.gioiTinh}
              onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <HiOutlineSave className="w-5 h-5" />
          Cập nhật
        </button>
      </form>
    </div>
  );
}

function QuanLyDiaChi() {
  const navigate = useNavigate();
  const [diaChi, setDiaChi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiaChi();
  }, []);

  const loadDiaChi = async () => {
    try {
      const data = await diaChiService.getDanhSach();
      setDiaChi(data);
    } catch (error) {
      console.error('Lỗi khi tải địa chỉ:', error);
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleXoa = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }
    try {
      await diaChiService.xoaDiaChi(id);
      toast.success('Đã xóa địa chỉ');
      loadDiaChi();
    } catch (error) {
      toast.error('Không thể xóa địa chỉ');
    }
  };

  const handleDatMacDinh = async (id) => {
    try {
      await diaChiService.datMacDinh(id);
      toast.success('Đã đặt làm địa chỉ mặc định');
      loadDiaChi();
    } catch (error) {
      toast.error('Không thể đặt địa chỉ mặc định');
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          <HiOutlineLocationMarker className="w-8 h-8 text-pink-600" />
          <span>Địa chỉ giao hàng</span>
        </h2>
        <button
          onClick={() => navigate('/them-dia-chi')}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Thêm địa chỉ
        </button>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
        </div>
      ) : diaChi.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
          <p className="text-gray-600 font-semibold text-lg mb-4">Chưa có địa chỉ nào</p>
          <button
            onClick={() => navigate('/them-dia-chi')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            ➕ Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {diaChi.map((dc) => (
            <div key={dc.id} className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-lg text-gray-800">{dc.tenNguoiNhan}</p>
                    {dc.macDinh && (
                      <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-1 rounded-full font-bold shadow-md">
                        <HiOutlineStar className="w-4 h-4" />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1 font-medium">{dc.duongPho}, {dc.phuongXa}, {dc.quanHuyen}, {dc.thanhPho}</p>
                  <p className="text-gray-500 font-medium">📱 {dc.soDienThoaiNhan}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDatMacDinh(dc.id)}
                    disabled={dc.macDinh}
                    className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Đặt làm mặc định"
                  >
                    <HiOutlineStar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleXoa(dc.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    title="Xóa địa chỉ"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuanLyThanhToan() {
  const [phuongThuc, setPhuongThuc] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhuongThuc();
  }, []);

  const loadPhuongThuc = async () => {
    // TODO: Implement load payment methods API
    setLoading(false);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          <HiOutlineCreditCard className="w-8 h-8 text-pink-600" />
          <span>Phương thức thanh toán</span>
        </h2>
        <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <HiOutlinePlus className="w-5 h-5" />
          Thêm phương thức
        </button>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
        </div>
      ) : phuongThuc.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
          <p className="text-gray-600 font-semibold text-lg">Chưa có phương thức thanh toán nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {phuongThuc.map((pt) => (
            <div key={pt.id} className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">{pt.loai} - {pt.nhaCungCap}</p>
                  <p className="text-gray-500 font-medium">****{pt.soThe?.slice(-4)}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg" title="Sửa">
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 font-semibold transition-all duration-300 shadow-md hover:shadow-lg" title="Xóa">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaiKhoan;

