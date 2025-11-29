import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';

function ChiTietDoanhThu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'tong';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaiThongKe, setLoaiThongKe] = useState('ngay');
  const [nam, setNam] = useState(new Date().getFullYear());
  const [quy, setQuy] = useState(null);

  useEffect(() => {
    loadData();
  }, [type, loaiThongKe, nam, quy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const doanhThu = await adminService.getThongKeDoanhThu(loaiThongKe, nam, quy);
      setData(doanhThu || []);
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

  const chartData = data.map(item => ({
    label: formatChartLabel(item),
    doanhThu: item.doanhThu || item.DoanhThu || 0,
    soDonHang: item.soDonHang || item.SoDonHang || 0,
  }));

  const tongDoanhThu = chartData.reduce((sum, item) => sum + item.doanhThu, 0);
  const tongDonHang = chartData.reduce((sum, item) => sum + item.soDonHang, 0);
  const trungBinhDonHang = tongDonHang > 0 ? tongDoanhThu / tongDonHang : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 hover:bg-white/30 rounded-xl transition-all"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Chi tiết Doanh thu
        </h1>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng doanh thu</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {formatPrice(tongDoanhThu)}
              </p>
            </div>
            <HiOutlineTrendingUp className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-700 text-sm mb-2 font-medium">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                {tongDonHang}
              </p>
            </div>
            <HiOutlineCalendar className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-700 text-sm mb-2 font-medium">Trung bình/đơn</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(trungBinhDonHang)}
              </p>
            </div>
            <HiOutlineTrendingUp className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
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
              className="px-3 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="px-3 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Năm"
              />
            )}
            {loaiThongKe === 'quy' && (
              <select
                value={quy || ''}
                onChange={(e) => setQuy(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-white/50 rounded-xl bg-white/30 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Bảng chi tiết */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-xl border border-white/50 p-6">
        <h2 className="text-xl font-bold mb-4">Bảng chi tiết</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left p-3 font-semibold text-gray-700">Thời gian</th>
                <th className="text-right p-3 font-semibold text-gray-700">Doanh thu</th>
                <th className="text-right p-3 font-semibold text-gray-700">Số đơn hàng</th>
                <th className="text-right p-3 font-semibold text-gray-700">Trung bình/đơn</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                  <td className="p-3 text-gray-700">{item.label}</td>
                  <td className="p-3 text-right font-semibold text-blue-600">{formatPrice(item.doanhThu)}</td>
                  <td className="p-3 text-right text-gray-700">{item.soDonHang}</td>
                  <td className="p-3 text-right text-gray-600">
                    {item.soDonHang > 0 ? formatPrice(item.doanhThu / item.soDonHang) : '-'}
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

export default ChiTietDoanhThu;


