import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { HiOutlineArrowRight, HiOutlineXCircle, HiOutlineRefresh } from 'react-icons/hi';

function Dashboard() {
  const [tongQuan, setTongQuan] = useState(null);
  const [doanhThuData, setDoanhThuData] = useState([]);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaiThongKe, setLoaiThongKe] = useState('ngay');
  const [nam, setNam] = useState(new Date().getFullYear());
  const [quy, setQuy] = useState(null);

  useEffect(() => {
    loadData();
  }, [loaiThongKe, nam, quy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tongQuanData, doanhThu, sanPham] = await Promise.all([
        adminService.getThongKeTongQuan(),
        adminService.getThongKeDoanhThu(loaiThongKe, nam, quy),
        adminService.getThongKeSanPham(10),
      ]);
      setTongQuan(tongQuanData);
      setDoanhThuData(doanhThu || []);
      setSanPhamBanChay(sanPham || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Không thể tải dữ liệu thống kê');
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

  const formatChartLabel = (item) => {
    if (loaiThongKe === 'ngay') {
      const date = item.ngay || item.Ngay;
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    } else if (loaiThongKe === 'thang') {
      return `Tháng ${item.thang || item.Thang}`;
    } else if (loaiThongKe === 'quy') {
      return `Q${item.quy || item.Quy}`;
    } else if (loaiThongKe === 'nam') {
      return `Năm ${item.nam || item.Nam}`;
    }
    return '';
  };

  const chartData = doanhThuData.map(item => ({
    label: formatChartLabel(item),
    doanhThu: item.doanhThu || item.DoanhThu || 0,
    soDonHang: item.soDonHang || item.SoDonHang || 0,
  }));

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard Quản Lý
      </h1>

      {/* Thống kê tổng quan */}
      {tongQuan && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/chi-tiet-doanh-thu?type=tong" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Tổng doanh thu</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{formatPrice(tongQuan.tongDoanhThu)}</p>
          </Link>
          <Link to="/admin/chi-tiet-doanh-thu?type=hom-nay" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Doanh thu hôm nay</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{formatPrice(tongQuan.doanhThuHomNay)}</p>
          </Link>
          <Link to="/admin/chi-tiet-don-hang?type=tong" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Tổng đơn hàng</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{tongQuan.tongDonHang}</p>
          </Link>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng sản phẩm</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{tongQuan.tongSanPham}</p>
          </div>
          <Link to="/admin/chi-tiet-doanh-thu?type=thang" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Doanh thu tháng này</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formatPrice(tongQuan.doanhThuThangNay)}</p>
          </Link>
          <Link to="/admin/chi-tiet-doanh-thu?type=nam" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Doanh thu năm này</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{formatPrice(tongQuan.doanhThuNamNay)}</p>
          </Link>
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng người dùng</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{tongQuan.tongNguoiDung}</p>
          </div>
          <Link to="/admin/chi-tiet-don-hang?type=cho-xac-nhan" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Đơn chờ xác nhận</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{tongQuan.donHangChoXacNhan}</p>
          </Link>
          <Link to="/admin/chi-tiet-don-hang?type=dang-giao" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Đơn đang giao</h3>
              <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{tongQuan.donHangDangGiao}</p>
          </Link>
          <Link to="/admin/chi-tiet-don-hang?type=da-huy" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Đơn đã hủy</h3>
              <HiOutlineXCircle className="w-5 h-5 text-red-600 opacity-50" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">{tongQuan.donHangDaHuy || 0}</p>
            {tongQuan.tongTienDonHuy > 0 && (
              <p className="text-sm text-gray-500 mt-1">Tổng: {formatPrice(tongQuan.tongTienDonHuy)}</p>
            )}
          </Link>
          <Link to="/admin/chi-tiet-don-hang?type=hoan-tra" className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 text-sm font-medium">Đơn hoàn trả</h3>
              <HiOutlineRefresh className="w-5 h-5 text-orange-600 opacity-50" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{tongQuan.donHangHoanTra || 0}</p>
            {tongQuan.tongTienDonHoanTra > 0 && (
              <p className="text-sm text-gray-500 mt-1">Tổng: {formatPrice(tongQuan.tongTienDonHoanTra)}</p>
            )}
          </Link>
        </div>
      )}

      {/* Biểu đồ doanh thu */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Biểu đồ doanh thu</h2>
          <div className="flex gap-2">
            <select
              value={loaiThongKe}
              onChange={(e) => {
                setLoaiThongKe(e.target.value);
                if (e.target.value !== 'quy') setQuy(null);
              }}
              className="px-3 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ngay">Theo ngày</option>
              <option value="thang">Theo tháng</option>
              <option value="quy">Theo quý</option>
              <option value="nam">Theo năm</option>
            </select>
            {loaiThongKe !== 'nam' && (
              <input
                type="number"
                value={nam}
                onChange={(e) => setNam(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg w-24"
                placeholder="Năm"
              />
            )}
            {loaiThongKe === 'quy' && (
              <select
                value={quy || ''}
                onChange={(e) => setQuy(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tất cả quý</option>
                <option value="1">Quý 1</option>
                <option value="2">Quý 2</option>
                <option value="3">Quý 3</option>
                <option value="4">Quý 4</option>
              </select>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'doanhThu') return formatPrice(value);
                return value;
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="doanhThu" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Doanh thu"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="soDonHang" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Số đơn hàng"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sản phẩm bán chạy */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
        <h2 className="text-xl font-bold mb-4">Top sản phẩm bán chạy</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">STT</th>
                <th className="text-left p-2">Sản phẩm</th>
                <th className="text-right p-2">Số lượng bán</th>
                <th className="text-right p-2">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {sanPhamBanChay.map((sp, index) => (
                <tr key={sp.sanPhamId || sp.SanPhamId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={sp.hinhAnhChinh || sp.HinhAnhChinh || '/placeholder.jpg'}
                        alt={sp.ten || sp.Ten}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{sp.ten || sp.Ten}</span>
                    </div>
                  </td>
                  <td className="text-right p-2">{sp.soLuongBan || sp.SoLuongBan}</td>
                  <td className="text-right p-2 font-semibold">
                    {formatPrice(sp.doanhThu || sp.DoanhThu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

