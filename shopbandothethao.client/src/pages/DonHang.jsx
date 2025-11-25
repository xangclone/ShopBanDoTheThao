import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donHangService } from '../services/donHangService';
import { toast } from 'react-toastify';
import { formatVietnamDate } from '../utils/dateUtils';
import ImageWithFallback from '../components/ImageWithFallback';

function DonHang() {
  const navigate = useNavigate();
  const [donHang, setDonHang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all'); // all, ChoXacNhan, DaXacNhan, DangGiao, DaGiao, DaHuy

  useEffect(() => {
    loadDonHang();
  }, []);

  const loadDonHang = async () => {
    try {
      const data = await donHangService.getDanhSach();
      setDonHang(data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoading(false);
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

  const getTrangThaiColor = (trangThai) => {
    switch (trangThai) {
      case 'DaGiao':
        return 'bg-green-100 text-green-800';
      case 'DaHuy':
        return 'bg-red-100 text-red-800';
      case 'DangGiao':
        return 'bg-blue-100 text-blue-800';
      case 'DaXacNhan':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredDonHang = selectedTab === 'all' 
    ? donHang 
    : donHang.filter(don => don.trangThai === selectedTab);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: donHang.length },
    { id: 'ChoXacNhan', label: 'Chờ xác nhận', count: donHang.filter(d => d.trangThai === 'ChoXacNhan').length },
    { id: 'DaXacNhan', label: 'Đã xác nhận', count: donHang.filter(d => d.trangThai === 'DaXacNhan').length },
    { id: 'DangGiao', label: 'Đang giao', count: donHang.filter(d => d.trangThai === 'DangGiao').length },
    { id: 'DaGiao', label: 'Đã giao', count: donHang.filter(d => d.trangThai === 'DaGiao').length },
    { id: 'DaHuy', label: 'Đã hủy', count: donHang.filter(d => d.trangThai === 'DaHuy').length },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    return formatVietnamDate(date);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (donHang.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Chưa có đơn hàng nào</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredDonHang.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonHang.map((don) => (
            <div 
              key={don.id} 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/don-hang/${don.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Mã đơn: {don.maDonHang}</h3>
                  <p className="text-gray-600">Ngày đặt: {formatDate(don.ngayDat)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded ${getTrangThaiColor(don.trangThai)}`}>
                    {getTrangThaiLabel(don.trangThai)}
                  </span>
                  <p className="mt-2 font-bold text-lg text-blue-600">
                    {formatPrice(don.tongTien)}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                {don.danhSachChiTiet?.map((ct) => (
                  <div key={ct.id} className="flex items-center space-x-4 mb-2">
                    <ImageWithFallback
                      src={ct.sanPham?.hinhAnhChinh}
                      alt={ct.sanPham?.ten}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{ct.sanPham?.ten}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {ct.soLuong} x {formatPrice(ct.gia)}
                      </p>
                    </div>
                    <p className="font-bold">{formatPrice(ct.thanhTien)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonHang;

