import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { yeuThichService } from '../services/yeuThichService';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

function YeuThich() {
  const [yeuThich, setYeuThich] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để xem danh sách yêu thích');
      navigate('/');
      return;
    }
    loadYeuThich();
  }, []);

  const loadYeuThich = async () => {
    setLoading(true);
    try {
      const response = await yeuThichService.getYeuThich();
      
      // Xử lý cả trường hợp response là array hoặc object có data property
      let data = response;
      if (response && typeof response === 'object' && !Array.isArray(response) && response.data) {
        data = response.data;
      }
      
      // Đảm bảo data là array
      if (!Array.isArray(data)) {
        console.warn('API response không phải là array:', data);
        setYeuThich([]);
        return;
      }
      
      // Lọc và normalize dữ liệu
      const validData = data
        .filter(item => {
          if (!item) return false;
          // Kiểm tra có sản phẩm (cả sanPham và SanPham)
          const sanPham = item.sanPham || item.SanPham;
          if (!sanPham) {
            console.warn('Item không có sản phẩm:', item);
            return false;
          }
          // Kiểm tra sản phẩm có đầy đủ thông tin cần thiết (xử lý cả id/Id và ten/Ten)
          const productId = sanPham.id || sanPham.Id;
          const productName = sanPham.ten || sanPham.Ten;
          if (!productId || !productName) {
            console.warn('Sản phẩm thiếu thông tin:', sanPham);
            return false;
          }
          return true;
        })
        .map(item => {
          // Normalize: đảm bảo luôn có sanPham (chữ s thường)
          const sanPham = item.sanPham || item.SanPham;
          return {
            id: item.id,
            ngayThem: item.ngayThem || item.NgayThem,
            sanPham: {
              id: sanPham.id || sanPham.Id,
              ten: sanPham.ten || sanPham.Ten || 'Sản phẩm',
              gia: sanPham.gia || sanPham.Gia || 0,
              giaGoc: sanPham.giaGoc || sanPham.GiaGoc || null,
              hinhAnhChinh: sanPham.hinhAnhChinh || sanPham.HinhAnhChinh || null,
              slug: sanPham.slug || sanPham.Slug || null,
              dangHoatDong: sanPham.dangHoatDong !== undefined ? sanPham.dangHoatDong : (sanPham.DangHoatDong !== undefined ? sanPham.DangHoatDong : true),
              dangKhuyenMai: sanPham.dangKhuyenMai !== undefined ? sanPham.dangKhuyenMai : (sanPham.DangKhuyenMai !== undefined ? sanPham.DangKhuyenMai : false),
              sanPhamNoiBat: sanPham.sanPhamNoiBat !== undefined ? sanPham.sanPhamNoiBat : (sanPham.SanPhamNoiBat !== undefined ? sanPham.SanPhamNoiBat : false),
            }
          };
        });
      
      setYeuThich(validData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách yêu thích:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải danh sách yêu thích';
      toast.error(errorMessage);
      setYeuThich([]);
    } finally {
      setLoading(false);
    }
  };

  const handleXoa = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
      return;
    }

    try {
      await yeuThichService.xoaKhoiYeuThich(id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
      loadYeuThich();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa');
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

  if (yeuThich.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto animate-fade-in bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-12 text-center">
          <div className="flex justify-center mb-6">
            <HiOutlineHeart className="w-24 h-24 text-pink-500" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Danh sách yêu thích trống
          </h2>
          <p className="text-gray-600 mb-8 font-medium text-lg">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá và thêm những sản phẩm bạn yêu thích!
          </p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
            Khám Phá Sản Phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 animate-fade-in">
          <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineHeart className="w-10 h-10 text-pink-600" />
            <span>Sản phẩm yêu thích</span>
          </h1>
          <p className="text-gray-600 font-semibold text-lg">
            Bạn có <span className="text-pink-600 font-bold text-xl">{yeuThich.length}</span> sản phẩm trong danh sách yêu thích
          </p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {yeuThich.map((item, index) => {
          // Đảm bảo item và sanPham tồn tại
          if (!item || !item.sanPham || !item.sanPham.id) {
            console.warn('Item không hợp lệ:', item);
            return null;
          }
          
          const sanPham = item.sanPham;
          
          // Đảm bảo các giá trị cần thiết
          if (!sanPham || !sanPham.id || !sanPham.ten) {
            console.warn('Sản phẩm không hợp lệ:', sanPham);
            return null;
          }
          
          // Đảm bảo giá có giá trị hợp lệ (mặc định là 0 nếu không có)
          const gia = Number(sanPham.gia) || 0;
          const giaGoc = sanPham.giaGoc ? Number(sanPham.giaGoc) : null;
          
          return (
            <div
              key={item.id}
              className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 border-pink-100/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => handleXoa(item.id)}
                className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-2xl hover:from-red-600 hover:to-pink-600 z-10 shadow-xl transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Xóa khỏi yêu thích"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
              <Link to={`/san-pham/${sanPham.id}`}>
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                  <ImageWithFallback
                    src={sanPham.hinhAnhChinh}
                    alt={sanPham.ten || 'Sản phẩm'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {sanPham.dangKhuyenMai && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
                      🔥 Sale
                    </span>
                  )}
                  {sanPham.sanPhamNoiBat && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
                      ⭐ Nổi bật
                    </span>
                  )}
                </div>
                <div className="p-5 bg-gradient-to-br from-white to-pink-50/30">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {sanPham.ten || 'Sản phẩm'}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(gia)}
                    </span>
                    {giaGoc && giaGoc > gia && (
                      <span className="text-gray-400 line-through text-sm font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(giaGoc)}
                      </span>
                    )}
                  </div>
                  {giaGoc && giaGoc > gia && (
                    <div className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-full text-sm font-bold">
                      Giảm {Math.round(((giaGoc - gia) / giaGoc) * 100)}%
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

export default YeuThich;
