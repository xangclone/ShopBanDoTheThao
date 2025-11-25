import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { danhMucService } from '../services/danhMucService';
import { thuongHieuService } from '../services/thuongHieuService';
import ProductCard from '../components/ProductCard';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

function DanhSachSanPham() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sanPham, setSanPham] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [thuongHieu, setThuongHieu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  // Lấy filters từ URL params
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    pageSize: 20,
    sortBy: searchParams.get('sortBy') || 'NgayTao',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    danhMucId: searchParams.get('danhMucId') ? parseInt(searchParams.get('danhMucId')) : null,
    thuongHieuId: searchParams.get('thuongHieuId') ? parseInt(searchParams.get('thuongHieuId')) : null,
    giaMin: searchParams.get('giaMin') ? parseFloat(searchParams.get('giaMin')) : null,
    giaMax: searchParams.get('giaMax') ? parseFloat(searchParams.get('giaMax')) : null,
    kichThuoc: searchParams.get('kichThuoc') || '',
    mauSac: searchParams.get('mauSac') || '',
    timKiem: searchParams.get('timKiem') || '',
  });

  useEffect(() => {
    loadDanhMuc();
    loadThuongHieu();
  }, []);

  // Theo dõi thay đổi URL params và cập nhật filters
  useEffect(() => {
    const timKiemFromUrl = searchParams.get('timKiem');
    const danhMucId = searchParams.get('danhMucId');
    const thuongHieuId = searchParams.get('thuongHieuId');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const page = searchParams.get('page');
    const giaMin = searchParams.get('giaMin');
    const giaMax = searchParams.get('giaMax');
    const kichThuoc = searchParams.get('kichThuoc');
    const mauSac = searchParams.get('mauSac');

    setFilters({
      page: page ? parseInt(page) : 1,
      pageSize: 20,
      sortBy: sortBy || 'NgayTao',
      sortOrder: sortOrder || 'desc',
      danhMucId: danhMucId ? parseInt(danhMucId) : null,
      thuongHieuId: thuongHieuId ? parseInt(thuongHieuId) : null,
      giaMin: giaMin ? parseFloat(giaMin) : null,
      giaMax: giaMax ? parseFloat(giaMax) : null,
      kichThuoc: kichThuoc || '',
      mauSac: mauSac || '',
      timKiem: timKiemFromUrl || '',
    });
  }, [searchParams]);

  useEffect(() => {
    loadSanPham();
  }, [filters]);


  const loadDanhMuc = async () => {
    try {
      const data = await danhMucService.getDanhSach();
      // Flatten danh mục cha và con
      const flatCategories = [];
      if (data && Array.isArray(data)) {
        data.forEach(cat => {
          flatCategories.push(cat);
          if (cat.danhMucCon && Array.isArray(cat.danhMucCon)) {
            flatCategories.push(...cat.danhMucCon);
          }
        });
      }
      setDanhMuc(flatCategories);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const loadThuongHieu = async () => {
    try {
      const data = await thuongHieuService.getDanhSach();
      setThuongHieu(data || []);
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
    }
  };

  const loadSanPham = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      // Chỉ gửi các params có giá trị
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const data = await sanPhamService.getDanhSach(params);
      setSanPham(data.data || data || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Cập nhật URL params
    const newParams = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k] !== null && newFilters[k] !== '' && newFilters[k] !== undefined) {
        newParams.set(k, newFilters[k]);
      }
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      page: 1,
      pageSize: 20,
      sortBy: 'NgayTao',
      sortOrder: 'desc',
      danhMucId: null,
      thuongHieuId: null,
      giaMin: null,
      giaMax: null,
      kichThuoc: '',
      mauSac: '',
      timKiem: '',
    };
    setFilters(resetFilters);
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Lấy danh sách kích thước và màu sắc duy nhất từ sản phẩm
  const getUniqueSizes = () => {
    const sizes = new Set();
    sanPham.forEach(sp => {
      if (sp.kichThuoc) sizes.add(sp.kichThuoc);
    });
    return Array.from(sizes).sort();
  };

  const getUniqueColors = () => {
    const colors = new Set();
    sanPham.forEach(sp => {
      if (sp.mauSac) colors.add(sp.mauSac);
    });
    return Array.from(colors).sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {filters.timKiem ? `Kết quả tìm kiếm: "${filters.timKiem}"` : 'Danh sách sản phẩm'}
            </h1>
            {filters.timKiem && (
              <button
                onClick={() => handleFilterChange('timKiem', '')}
                className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
                Xóa bộ lọc tìm kiếm
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
          >
          <HiOutlineFilter className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className={`w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                <HiOutlineFilter className="w-7 h-7 text-pink-600" />
                <span>Bộ lọc</span>
              </h2>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-600 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <HiOutlineX className="w-4 h-4" />
                Xóa tất cả
              </button>
            </div>

            {/* Sắp xếp */}
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-gray-700">📊 Sắp xếp</h3>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
              >
                <option value="NgayTao-desc">Mới nhất</option>
                <option value="NgayTao-asc">Cũ nhất</option>
                <option value="gia-asc">Giá: Thấp đến cao</option>
                <option value="gia-desc">Giá: Cao đến thấp</option>
                <option value="banchay-desc">Bán chạy nhất</option>
                <option value="danhgia-desc">Đánh giá cao nhất</option>
                <option value="ten-asc">Tên: A-Z</option>
                <option value="ten-desc">Tên: Z-A</option>
              </select>
            </div>

            {/* Danh mục */}
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-gray-700">📁 Danh mục</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {danhMuc.map((dm) => (
                  <label key={dm.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 group">
                    <input
                      type="radio"
                      name="danhMucId"
                      checked={filters.danhMucId === dm.id}
                      onChange={() => handleFilterChange('danhMucId', dm.id)}
                      className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">{dm.ten}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thương hiệu */}
            {thuongHieu.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-700">🏷️ Thương hiệu</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {thuongHieu.map((th) => (
                    <label key={th.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 group">
                      <input
                        type="radio"
                        name="thuongHieuId"
                        checked={filters.thuongHieuId === th.id}
                        onChange={() => handleFilterChange('thuongHieuId', th.id)}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">{th.ten}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Giá */}
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-gray-700">💰 Khoảng giá</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Từ (VNĐ)</label>
                  <input
                    type="number"
                    value={filters.giaMin || ''}
                    onChange={(e) => handleFilterChange('giaMin', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Đến (VNĐ)</label>
                  <input
                    type="number"
                    value={filters.giaMax || ''}
                    onChange={(e) => handleFilterChange('giaMax', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Không giới hạn"
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 0);
                    handleFilterChange('giaMax', 500000);
                  }}
                  className="text-xs px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Dưới 500k
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 500000);
                    handleFilterChange('giaMax', 1000000);
                  }}
                  className="text-xs px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  500k-1tr
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 1000000);
                    handleFilterChange('giaMax', null);
                  }}
                  className="text-xs px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl hover:from-pink-200 hover:to-purple-200 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Trên 1tr
                </button>
              </div>
            </div>

            {/* Kích thước */}
            {getUniqueSizes().length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-700">📏 Kích thước</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('kichThuoc', filters.kichThuoc === size ? '' : size)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                        filters.kichThuoc === size
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500 shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Màu sắc */}
            {getUniqueColors().length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-700">🎨 Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueColors().map((color) => (
                    <button
                      key={color}
                      onClick={() => handleFilterChange('mauSac', filters.mauSac === color ? '' : color)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                        filters.mauSac === color
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500 shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 px-4 py-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50">
                <p className="text-gray-700 font-semibold">
                  Tìm thấy <span className="text-pink-600 font-bold text-lg">{totalCount}</span> sản phẩm
                </p>
              </div>
              {sanPham.length === 0 ? (
                <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 border-pink-100/50">
                  <p className="text-gray-600 text-xl font-semibold mb-4">Không tìm thấy sản phẩm nào</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sanPham.map((sp) => (
                      <ProductCard key={sp.id} product={sp} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center gap-3">
                      <button
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-5 py-3 border-2 border-pink-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        ← Trước
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= filters.page - 1 && page <= filters.page + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handleFilterChange('page', page)}
                              className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
                                filters.page === page
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-pink-500 shadow-xl scale-110'
                                  : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === filters.page - 2 || page === filters.page + 2) {
                          return <span key={page} className="px-2 text-gray-500 font-bold">...</span>;
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="px-5 py-3 border-2 border-pink-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                      >
                        Sau →
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default DanhSachSanPham;
