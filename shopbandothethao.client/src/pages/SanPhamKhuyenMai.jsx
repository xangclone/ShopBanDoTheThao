import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { danhMucService } from '../services/danhMucService';
import { thuongHieuService } from '../services/thuongHieuService';
import ProductCard from '../components/ProductCard';
import { HiOutlineGift, HiOutlineFire, HiOutlineLightningBolt, HiOutlineExclamationCircle, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

function SanPhamKhuyenMai() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sanPham, setSanPham] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [thuongHieu, setThuongHieu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  // Filters với dangKhuyenMai mặc định là true
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
    dangKhuyenMai: true, // Luôn filter sản phẩm khuyến mãi
  });

  useEffect(() => {
    loadData();
    loadDanhMuc();
    loadThuongHieu();
  }, []);

  useEffect(() => {
    loadSanPham();
  }, [filters]);

  const loadData = () => {
    const danhMucId = searchParams.get('danhMucId');
    const thuongHieuId = searchParams.get('thuongHieuId');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    
    if (danhMucId || thuongHieuId || sortBy || sortOrder) {
      setFilters(prev => ({
        ...prev,
        danhMucId: danhMucId ? parseInt(danhMucId) : null,
        thuongHieuId: thuongHieuId ? parseInt(thuongHieuId) : null,
        sortBy: sortBy || 'NgayTao',
        sortOrder: sortOrder || 'desc',
        dangKhuyenMai: true,
      }));
    }
  };

  const loadDanhMuc = async () => {
    try {
      const data = await danhMucService.getDanhSach();
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
    const newFilters = { ...filters, [key]: value, page: 1, dangKhuyenMai: true };
    setFilters(newFilters);
    
    // Cập nhật URL params
    const newParams = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k] !== null && newFilters[k] !== '' && newFilters[k] !== undefined && k !== 'dangKhuyenMai') {
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
      dangKhuyenMai: true,
    };
    setFilters(resetFilters);
    setSearchParams({});
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header với banner khuyến mãi */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <HiOutlineGift className="w-16 h-16 text-white" />
              <h1 className="text-4xl md:text-5xl font-extrabold">Sản phẩm khuyến mãi</h1>
            </div>
            <p className="text-xl md:text-2xl opacity-95 font-medium mb-6">
              Khám phá những ưu đãi hấp dẫn nhất dành cho bạn
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border-2 border-white/30">
                <HiOutlineFire className="w-5 h-5" />
                Giảm giá lên đến 50%
              </span>
              <span className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border-2 border-white/30">
                <HiOutlineLightningBolt className="w-5 h-5" />
                Mua ngay kẻo hết
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="px-4 py-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50">
            <p className="text-gray-700 font-semibold">
              {!loading && (
                <>
                  Tìm thấy <span className="text-pink-600 font-bold text-lg">{totalCount}</span> sản phẩm khuyến mãi
                </>
              )}
            </p>
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
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <HiOutlineFilter className="w-6 h-6 text-pink-600" />
                <span>Bộ lọc</span>
              </h2>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <HiOutlineX className="w-4 h-4" />
                Xóa tất cả
              </button>
            </div>

            {/* Sắp xếp */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Sắp xếp</h3>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {danhMuc.map((dm) => (
                  <label key={dm.id} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="danhMucId"
                      checked={filters.danhMucId === dm.id}
                      onChange={() => handleFilterChange('danhMucId', dm.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{dm.ten}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thương hiệu */}
            {thuongHieu.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Thương hiệu</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {thuongHieu.map((th) => (
                    <label key={th.id} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                      <input
                        type="radio"
                        name="thuongHieuId"
                        checked={filters.thuongHieuId === th.id}
                        onChange={() => handleFilterChange('thuongHieuId', th.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{th.ten}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Giá */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Khoảng giá</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Từ (VNĐ)</label>
                  <input
                    type="number"
                    value={filters.giaMin || ''}
                    onChange={(e) => handleFilterChange('giaMin', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Đến (VNĐ)</label>
                  <input
                    type="number"
                    value={filters.giaMax || ''}
                    onChange={(e) => handleFilterChange('giaMax', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Không giới hạn"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 0);
                    handleFilterChange('giaMax', 500000);
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Dưới 500k
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 500000);
                    handleFilterChange('giaMax', 1000000);
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  500k-1tr
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('giaMin', 1000000);
                    handleFilterChange('giaMax', null);
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Trên 1tr
                </button>
              </div>
            </div>

            {/* Kích thước */}
            {getUniqueSizes().length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Kích thước</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('kichThuoc', filters.kichThuoc === size ? '' : size)}
                      className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                        filters.kichThuoc === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
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
                <h3 className="font-semibold mb-3">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueColors().map((color) => (
                    <button
                      key={color}
                      onClick={() => handleFilterChange('mauSac', filters.mauSac === color ? '' : color)}
                      className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                        filters.mauSac === color
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              {sanPham.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <HiOutlineExclamationCircle className="w-16 h-16 text-pink-500" />
                  </div>
                  <p className="text-gray-500 text-lg mb-2">Không tìm thấy sản phẩm khuyến mãi nào</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 text-blue-600 hover:text-blue-700"
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
                    <div className="mt-8 flex justify-center gap-2">
                      <button
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Trước
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
                              className={`px-4 py-2 border rounded-lg ${
                                filters.page === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === filters.page - 2 || page === filters.page + 2) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                        disabled={filters.page === totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Sau
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

export default SanPhamKhuyenMai;


