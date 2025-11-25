import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { HiOutlineStar, HiOutlineEye, HiOutlineEyeOff, HiOutlineTrash, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { getImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../../components/ImageWithFallback';
import { formatVietnamDateTimeFull } from '../../utils/dateUtils';

function QuanLyDanhGia() {
  const [danhGias, setDanhGias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    timKiem: '',
    hienThi: null, // null = tất cả, true = hiển thị, false = ẩn
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadDanhGias();
  }, [page, filters]);

  const loadDanhGias = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDanhSachDanhGia(
        filters.timKiem || undefined,
        undefined, // sanPhamId
        filters.hienThi !== null ? filters.hienThi : undefined,
        page,
        20
      );
      setDanhGias(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách đánh giá');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHienThi = async (id, currentHienThi) => {
    try {
      await adminService.capNhatHienThiDanhGia(id, !currentHienThi);
      toast.success(currentHienThi ? 'Đã ẩn đánh giá' : 'Đã hiển thị đánh giá');
      loadDanhGias();
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) return;
    
    try {
      await adminService.xoaDanhGia(id);
      toast.success('Xóa đánh giá thành công');
      loadDanhGias();
    } catch (error) {
      toast.error('Không thể xóa đánh giá');
    }
  };

  const renderStars = (soSao) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <HiOutlineStar
            key={i}
            className={`w-4 h-4 ${
              i < soSao
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">{soSao}/5</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Quản lý Đánh giá
          </h1>
          <p className="text-gray-600">Quản lý và kiểm duyệt đánh giá sản phẩm từ khách hàng</p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo nội dung, sản phẩm, khách hàng..."
                value={filters.timKiem}
                onChange={(e) => setFilters({ ...filters, timKiem: e.target.value, page: 1 })}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/50 backdrop-blur-sm transition-all"
              />
              {filters.timKiem && (
                <button
                  onClick={() => setFilters({ ...filters, timKiem: '', page: 1 })}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter by visibility */}
            <select
              value={filters.hienThi === null ? 'all' : filters.hienThi ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value === 'all' ? null : e.target.value === 'true';
                setFilters({ ...filters, hienThi: value, page: 1 });
              }}
              className="px-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/50 backdrop-blur-sm transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đã ẩn</option>
            </select>

            {/* Stats */}
            <div className="flex items-center justify-end gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Tổng số đánh giá</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {totalCount.toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : danhGias.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/50 p-12 text-center">
            <p className="text-gray-500 text-lg">Không có đánh giá nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {danhGias.map((danhGia) => (
              <div
                key={danhGia.id}
                className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                  danhGia.hienThi
                    ? 'border-white/50 hover:border-pink-300/50'
                    : 'border-gray-200/50 opacity-75'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Info */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-white/50">
                          <ImageWithFallback
                            src={danhGia.sanPham?.hinhAnhChinh}
                            alt={danhGia.sanPham?.ten}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {danhGia.sanPham?.ten || 'Sản phẩm đã bị xóa'}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {danhGia.sanPham?.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            {renderStars(danhGia.soSao)}
                            <span className="text-sm text-gray-500">
                              {formatVietnamDateTimeFull(danhGia.ngayTao)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-800">
                              {danhGia.nguoiDung?.ho} {danhGia.nguoiDung?.ten}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({danhGia.nguoiDung?.email})
                            </span>
                          </div>
                          {danhGia.noiDung && (
                            <p className="text-gray-700 mb-2 leading-relaxed">{danhGia.noiDung}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {danhGia.daXacNhanMua && (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                                ✓ Đã mua
                              </span>
                            )}
                            {danhGia.soLuongThich > 0 && (
                              <span className="flex items-center gap-1">
                                ❤️ {danhGia.soLuongThich} lượt thích
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleToggleHienThi(danhGia.id, danhGia.hienThi)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          danhGia.hienThi
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={danhGia.hienThi ? 'Ẩn đánh giá' : 'Hiển thị đánh giá'}
                      >
                        {danhGia.hienThi ? (
                          <>
                            <HiOutlineEyeOff className="w-5 h-5" />
                            Ẩn
                          </>
                        ) : (
                          <>
                            <HiOutlineEye className="w-5 h-5" />
                            Hiển thị
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(danhGia.id)}
                        className="px-4 py-2 rounded-xl font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center gap-2"
                        title="Xóa đánh giá"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-xl border-2 border-pink-100 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Trước
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white/70 backdrop-blur-xl border-2 border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === page - 2 || pageNum === page + 2) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-xl border-2 border-pink-100 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuanLyDanhGia;

