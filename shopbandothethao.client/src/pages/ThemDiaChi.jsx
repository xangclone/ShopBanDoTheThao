import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaChiService } from '../services/diaChiService';
import { diaLyService } from '../services/diaLyService';
import { toast } from 'react-toastify';
import { 
  HiOutlineLocationMarker, 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineHome, 
  HiOutlineMail, 
  HiOutlineSave,
  HiOutlineX
} from 'react-icons/hi';

function ThemDiaChi() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [tinhThanhPho, setTinhThanhPho] = useState([]);
  const [quanHuyenList, setQuanHuyenList] = useState([]);
  const [phuongXaList, setPhuongXaList] = useState([]);
  const [formData, setFormData] = useState({
    tenNguoiNhan: '',
    soDienThoaiNhan: '',
    duongPho: '',
    phuongXa: '',
    phuongXaCode: '',
    quanHuyen: '',
    quanHuyenCode: '',
    thanhPho: '',
    thanhPhoCode: '',
    maBuuChinh: '',
    loaiDiaChi: 'NhaRieng',
    macDinh: false,
  });

  useEffect(() => {
    loadTinhThanhPho();
  }, []);

  const loadTinhThanhPho = async () => {
    setLoadingData(true);
    try {
      const data = await diaLyService.getTinhThanhPho();
      console.log('Dữ liệu tỉnh/thành phố:', data);
      
      if (!data || data.length === 0) {
        toast.error('Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.');
        setTinhThanhPho([]);
        return;
      }
      
      // Sắp xếp theo tên
      const sorted = data.sort((a, b) => {
        const nameA = (a.name_with_type || a.name || '').toLowerCase();
        const nameB = (b.name_with_type || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB, 'vi');
      });
      setTinhThanhPho(sorted);
    } catch (error) {
      console.error('Lỗi khi tải tỉnh/thành phố:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
      setTinhThanhPho([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTinhThanhChange = async (e) => {
    const selectedCode = e.target.value;
    console.log('Selected province code:', selectedCode);
    
    if (!selectedCode) {
      setFormData({ 
        ...formData, 
        thanhPho: '',
        thanhPhoCode: '',
        quanHuyen: '',
        quanHuyenCode: '',
        phuongXa: '',
        phuongXaCode: ''
      });
      setQuanHuyenList([]);
      setPhuongXaList([]);
      return;
    }
    
    const selectedTinh = tinhThanhPho.find(t => String(t.code) === String(selectedCode));
    console.log('Selected province:', selectedTinh);
    
    if (selectedTinh) {
      setFormData({ 
        ...formData, 
        thanhPho: selectedTinh.name_with_type || selectedTinh.name,
        thanhPhoCode: String(selectedTinh.code),
        quanHuyen: '',
        quanHuyenCode: '',
        phuongXa: '',
        phuongXaCode: ''
      });
      setQuanHuyenList([]);
      setPhuongXaList([]);
      
      // Load quận/huyện
      try {
        const quanHuyen = await diaLyService.getQuanHuyen(selectedTinh.code);
        console.log('Quận/huyện loaded:', quanHuyen.length);
        setQuanHuyenList(quanHuyen);
      } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
        toast.error('Không thể tải danh sách quận/huyện');
        setQuanHuyenList([]);
      }
    } else {
      console.warn('Không tìm thấy tỉnh với code:', selectedCode);
      setFormData({ 
        ...formData, 
        thanhPho: '',
        thanhPhoCode: '',
        quanHuyen: '',
        quanHuyenCode: '',
        phuongXa: '',
        phuongXaCode: ''
      });
      setQuanHuyenList([]);
      setPhuongXaList([]);
    }
  };

  const handleQuanHuyenChange = async (e) => {
    const selectedCode = e.target.value;
    
    if (!selectedCode) {
      setFormData({ 
        ...formData, 
        quanHuyen: '',
        quanHuyenCode: '',
        phuongXa: '',
        phuongXaCode: ''
      });
      setPhuongXaList([]);
      return;
    }
    
    const selectedQuanHuyen = quanHuyenList.find(q => String(q.code) === String(selectedCode));
    
    if (selectedQuanHuyen) {
      setFormData({ 
        ...formData, 
        quanHuyen: selectedQuanHuyen.name_with_type || selectedQuanHuyen.name,
        quanHuyenCode: String(selectedQuanHuyen.code),
        phuongXa: '',
        phuongXaCode: ''
      });
      setPhuongXaList([]);
      
      // Load phường/xã
      try {
        const phuongXa = await diaLyService.getPhuongXa(selectedQuanHuyen.code);
        setPhuongXaList(phuongXa);
      } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
        toast.error('Không thể tải danh sách phường/xã');
        setPhuongXaList([]);
      }
    } else {
      setFormData({ 
        ...formData, 
        quanHuyen: '',
        quanHuyenCode: '',
        phuongXa: '',
        phuongXaCode: ''
      });
      setPhuongXaList([]);
    }
  };

  const handlePhuongXaChange = (e) => {
    const selectedCode = e.target.value;
    
    if (!selectedCode) {
      setFormData({ 
        ...formData, 
        phuongXa: '',
        phuongXaCode: ''
      });
      return;
    }
    
    const selectedPhuongXa = phuongXaList.find(p => String(p.code) === String(selectedCode));
    
    if (selectedPhuongXa) {
      setFormData({ 
        ...formData, 
        phuongXa: selectedPhuongXa.name_with_type || selectedPhuongXa.name,
        phuongXaCode: String(selectedPhuongXa.code)
      });
    } else {
      setFormData({ 
        ...formData, 
        phuongXa: '',
        phuongXaCode: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenNguoiNhan || !formData.soDienThoaiNhan || !formData.duongPho || !formData.thanhPho) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        tenNguoiNhan: formData.tenNguoiNhan,
        soDienThoaiNhan: formData.soDienThoaiNhan,
        duongPho: formData.duongPho,
        phuongXa: formData.phuongXa || null,
        quanHuyen: formData.quanHuyen || null,
        thanhPho: formData.thanhPho,
        maBuuChinh: formData.maBuuChinh || null,
        loaiDiaChi: formData.loaiDiaChi,
        macDinh: formData.macDinh,
      };
      
      await diaChiService.themDiaChi(dataToSend);
      toast.success('Thêm địa chỉ thành công!');
      navigate('/tai-khoan?tab=diachi');
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể thêm địa chỉ';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Đang tải dữ liệu địa lý...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="flex items-center gap-3 text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <HiOutlineLocationMarker className="w-10 h-10 text-pink-600" />
              <span>Thêm địa chỉ mới</span>
            </h1>
            <button
              onClick={() => navigate('/tai-khoan?tab=diachi')}
              className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl hover:from-pink-200 hover:to-purple-200 text-gray-700 hover:text-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 flex items-center justify-center"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineUser className="w-5 h-5 text-pink-600" />
              <span>Họ tên người nhận <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={formData.tenNguoiNhan}
              onChange={(e) => setFormData({ ...formData, tenNguoiNhan: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              placeholder="Nhập họ tên người nhận"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlinePhone className="w-5 h-5 text-pink-600" />
              <span>Số điện thoại <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={formData.soDienThoaiNhan}
              onChange={(e) => setFormData({ ...formData, soDienThoaiNhan: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineLocationMarker className="w-5 h-5 text-pink-600" />
              <span>Tỉnh/Thành phố <span className="text-red-500">*</span></span>
            </label>
            <select
              required
              value={formData.thanhPhoCode}
              onChange={handleTinhThanhChange}
              disabled={loadingData}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <option value="">{loadingData ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}</option>
              {tinhThanhPho.map((tinh) => (
                <option key={tinh.code} value={String(tinh.code)}>
                  {tinh.name_with_type || tinh.name}
                </option>
              ))}
            </select>
            {tinhThanhPho.length === 0 && !loadingData && (
              <p className="text-sm text-red-500 mt-1">Không thể tải danh sách tỉnh/thành phố. Vui lòng tải lại trang.</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineLocationMarker className="w-5 h-5 text-pink-600" />
              <span>Quận/Huyện</span>
            </label>
            <select
              value={formData.quanHuyenCode}
              onChange={handleQuanHuyenChange}
              disabled={!formData.thanhPhoCode}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <option value="">Chọn quận/huyện</option>
              {quanHuyenList.map((qh) => (
                <option key={qh.code} value={String(qh.code)}>
                  {qh.name_with_type || qh.name}
                </option>
              ))}
            </select>
            {!formData.thanhPhoCode && (
              <p className="text-sm text-gray-500 mt-2 font-medium">Vui lòng chọn tỉnh/thành phố trước</p>
            )}
            {formData.thanhPhoCode && quanHuyenList.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 font-medium">Đang tải danh sách quận/huyện...</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineLocationMarker className="w-5 h-5 text-pink-600" />
              <span>Phường/Xã</span>
            </label>
            <select
              value={formData.phuongXaCode}
              onChange={handlePhuongXaChange}
              disabled={!formData.quanHuyenCode}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 disabled:opacity-50"
            >
              <option value="">Chọn phường/xã</option>
              {phuongXaList.map((px) => (
                <option key={px.code} value={String(px.code)}>
                  {px.name_with_type || px.name}
                </option>
              ))}
            </select>
            {!formData.quanHuyenCode && (
              <p className="text-sm text-gray-500 mt-2 font-medium">Vui lòng chọn quận/huyện trước</p>
            )}
            {formData.quanHuyenCode && phuongXaList.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 font-medium">Đang tải danh sách phường/xã...</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineLocationMarker className="w-5 h-5 text-pink-600" />
              <span>Đường phố, số nhà <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={formData.duongPho}
              onChange={(e) => setFormData({ ...formData, duongPho: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              placeholder="Ví dụ: 123 Nguyễn Văn A"
            />
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Nhập địa chỉ chi tiết: số nhà, tên đường, tòa nhà (nếu có)
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineMail className="w-5 h-5 text-pink-600" />
              <span>Mã bưu chính</span>
            </label>
            <input
              type="text"
              value={formData.maBuuChinh}
              onChange={(e) => setFormData({ ...formData, maBuuChinh: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              placeholder="Mã bưu chính (tùy chọn)"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-700">
              <HiOutlineHome className="w-5 h-5 text-pink-600" />
              <span>Loại địa chỉ</span>
            </label>
            <select
              value={formData.loaiDiaChi}
              onChange={(e) => setFormData({ ...formData, loaiDiaChi: e.target.value })}
              className="w-full px-5 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
            >
              <option value="NhaRieng">Nhà riêng</option>
              <option value="VanPhong">Văn phòng</option>
              <option value="Khac">Khác</option>
            </select>
          </div>

          <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-100">
            <input
              type="checkbox"
              id="macDinh"
              checked={formData.macDinh}
              onChange={(e) => setFormData({ ...formData, macDinh: e.target.checked })}
              className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
            />
            <label htmlFor="macDinh" className="ml-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <HiOutlineLocationMarker className="w-4 h-4 text-yellow-500" />
              <span>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/tai-khoan?tab=diachi')}
              className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-pink-200 text-gray-700 py-3 rounded-2xl hover:bg-pink-50 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <HiOutlineSave className="w-5 h-5" />
                  <span>Lưu địa chỉ</span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

export default ThemDiaChi;
