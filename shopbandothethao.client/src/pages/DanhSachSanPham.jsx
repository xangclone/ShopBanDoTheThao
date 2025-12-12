import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { danhMucService } from '../services/danhMucService';
import { thuongHieuService } from '../services/thuongHieuService';
import ProductCard from '../components/ProductCard';
import { 
  HiOutlineFilter, 
  HiOutlineX, 
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineSortAscending,
  HiOutlineSearch,
  HiOutlineCollection,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineViewGrid,
  HiOutlineSparkles
} from 'react-icons/hi';

function DanhSachSanPham() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sanPham, setSanPham] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [thuongHieu, setThuongHieu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    category: true,
    brand: true,
    price: true,
    size: true,
    color: true,
  });

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.danhMucId) count++;
    if (filters.thuongHieuId) count++;
    if (filters.giaMin || filters.giaMax) count++;
    if (filters.kichThuoc) count++;
    if (filters.mauSac) count++;
    if (filters.timKiem) count++;
    return count;
  };

  const getUniqueSizes = () => {
    const sizes = new Set();
    sanPham.forEach(sp => {
      if (sp.danhSachBienThe && Array.isArray(sp.danhSachBienThe)) {
        sp.danhSachBienThe.forEach(bt => {
          if (bt.kichThuoc) sizes.add(bt.kichThuoc);
        });
      }
      if (sp.kichThuoc) sizes.add(sp.kichThuoc);
    });
    return Array.from(sizes).sort();
  };

  const getUniqueColors = () => {
    const colors = new Set();
    sanPham.forEach(sp => {
      if (sp.danhSachBienThe && Array.isArray(sp.danhSachBienThe)) {
        sp.danhSachBienThe.forEach(bt => {
          if (bt.mauSac) colors.add(bt.mauSac);
        });
      }
      if (sp.mauSac) colors.add(sp.mauSac);
    });
    return Array.from(colors).sort();
  };

  const FilterSection = ({ title, icon: Icon, sectionKey, children, defaultExpanded = true }) => {
    const isExpanded = expandedSections[sectionKey] ?? defaultExpanded;
    return (
      <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between mb-3 text-left hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-pink-600" />}
            <h3 className="font-bold text-gray-800">{title}</h3>
          </div>
          {isExpanded ? (
            <HiOutlineChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <HiOutlineChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {filters.timKiem ? `Kết quả tìm kiếm: "${filters.timKiem}"` : 'Danh sách sản phẩm'}
              </h1>
              {filters.timKiem && (
                <button
                  onClick={() => handleFilterChange('timKiem', '')}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <HiOutlineX className="w-4 h-4" />
                  Xóa tìm kiếm
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              <HiOutlineFilter className="w-5 h-5" />
              Bộ lọc
              {getActiveFiltersCount() > 0 && (
                <span className="bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          {/* Active filters bar */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-pink-100">
              <span className="text-sm font-semibold text-gray-700">Bộ lọc đang áp dụng:</span>
              {filters.danhMucId && (
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {danhMuc.find(dm => dm.id === filters.danhMucId)?.ten}
                  <button onClick={() => handleFilterChange('danhMucId', null)} className="ml-1 hover:text-pink-900">
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.thuongHieuId && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {thuongHieu.find(th => th.id === filters.thuongHieuId)?.ten}
                  <button onClick={() => handleFilterChange('thuongHieuId', null)} className="ml-1 hover:text-purple-900">
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.giaMin || filters.giaMax) && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                  {filters.giaMin ? `${(filters.giaMin / 1000).toFixed(0)}k` : '0'} - {filters.giaMax ? `${(filters.giaMax / 1000).toFixed(0)}k` : '∞'}
                  <button onClick={() => {
                    handleFilterChange('giaMin', null);
                    handleFilterChange('giaMax', null);
                  }} className="ml-1 hover:text-indigo-900">
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.kichThuoc && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Size: {filters.kichThuoc}
                  <button onClick={() => handleFilterChange('kichThuoc', '')} className="ml-1 hover:text-blue-900">
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.mauSac && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Màu: {filters.mauSac}
                  <button onClick={() => handleFilterChange('mauSac', '')} className="ml-1 hover:text-green-900">
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="ml-auto px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <HiOutlineX className="w-3 h-3" />
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className={`w-full lg:w-80 flex-shrink-0 ${showFilter ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-5 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <HiOutlineFilter className="w-6 h-6 text-pink-600" />
                  Bộ lọc
                </h2>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <HiOutlineX className="w-4 h-4" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {/* Sắp xếp */}
                <FilterSection title="Sắp xếp" icon={HiOutlineSortAscending} sectionKey="sort">
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-sm font-medium transition-all"
                  >
                    <option value="NgayTao-desc">Mới nhất</option>
                    <option value="NgayTao-asc">Cũ nhất</option>
                    <option value="gia-asc">Giá: Thấp → Cao</option>
                    <option value="gia-desc">Giá: Cao → Thấp</option>
                    <option value="banchay-desc">Bán chạy nhất</option>
                    <option value="danhgia-desc">Đánh giá cao nhất</option>
                    <option value="ten-asc">Tên: A → Z</option>
                    <option value="ten-desc">Tên: Z → A</option>
                  </select>
                </FilterSection>

                {/* Danh mục */}
                {danhMuc.length > 0 && (
                  <FilterSection title="Danh mục" icon={HiOutlineCollection} sectionKey="category">
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-pink-50 transition-colors group">
                        <input
                          type="radio"
                          name="danhMucId"
                          checked={filters.danhMucId === null}
                          onChange={() => handleFilterChange('danhMucId', null)}
                          className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">Tất cả</span>
                      </label>
                      {danhMuc.map((dm) => (
                        <label key={dm.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-pink-50 transition-colors group">
                          <input
                            type="radio"
                            name="danhMucId"
                            checked={filters.danhMucId === dm.id}
                            onChange={() => handleFilterChange('danhMucId', dm.id)}
                            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{dm.ten}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Thương hiệu */}
                {thuongHieu.length > 0 && (
                  <FilterSection title="Thương hiệu" icon={HiOutlineTag} sectionKey="brand">
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors group">
                        <input
                          type="radio"
                          name="thuongHieuId"
                          checked={filters.thuongHieuId === null}
                          onChange={() => handleFilterChange('thuongHieuId', null)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Tất cả</span>
                      </label>
                      {thuongHieu.map((th) => (
                        <label key={th.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors group">
                          <input
                            type="radio"
                            name="thuongHieuId"
                            checked={filters.thuongHieuId === th.id}
                            onChange={() => handleFilterChange('thuongHieuId', th.id)}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">{th.ten}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Giá */}
                <FilterSection title="Khoảng giá" icon={HiOutlineCurrencyDollar} sectionKey="price">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600 font-medium mb-1 block">Từ (VNĐ)</label>
                        <input
                          type="number"
                          value={filters.giaMin || ''}
                          onChange={(e) => handleFilterChange('giaMin', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-medium mb-1 block">Đến (VNĐ)</label>
                        <input
                          type="number"
                          value={filters.giaMax || ''}
                          onChange={(e) => handleFilterChange('giaMax', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="∞"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          handleFilterChange('giaMin', 0);
                          handleFilterChange('giaMax', 500000);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Dưới 500k
                      </button>
                      <button
                        onClick={() => {
                          handleFilterChange('giaMin', 500000);
                          handleFilterChange('giaMax', 1000000);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        500k-1tr
                      </button>
                      <button
                        onClick={() => {
                          handleFilterChange('giaMin', 1000000);
                          handleFilterChange('giaMax', null);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Trên 1tr
                      </button>
                    </div>
                  </div>
                </FilterSection>

                {/* Kích thước */}
                {getUniqueSizes().length > 0 && (
                  <FilterSection title="Kích thước" icon={HiOutlineViewGrid} sectionKey="size">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('kichThuoc', '')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          !filters.kichThuoc
                            ? 'bg-pink-500 text-white border-pink-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        Tất cả
                      </button>
                      {getUniqueSizes().map((size) => (
                        <button
                          key={size}
                          onClick={() => handleFilterChange('kichThuoc', filters.kichThuoc === size ? '' : size)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            filters.kichThuoc === size
                              ? 'bg-pink-500 text-white border-pink-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Màu sắc */}
                {getUniqueColors().length > 0 && (
                  <FilterSection title="Màu sắc" icon={HiOutlineSparkles} sectionKey="color">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('mauSac', '')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          !filters.mauSac
                            ? 'bg-pink-500 text-white border-pink-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        Tất cả
                      </button>
                      {getUniqueColors().map((color) => (
                        <button
                          key={color}
                          onClick={() => handleFilterChange('mauSac', filters.mauSac === color ? '' : color)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            filters.mauSac === color
                              ? 'bg-pink-500 text-white border-pink-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-700 font-medium">
                Tìm thấy <span className="font-bold text-pink-600">{totalCount}</span> sản phẩm
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
                <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
              </div>
            ) : (
              <>
                {sanPham.length === 0 ? (
                  <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                    <p className="text-gray-600 text-xl font-semibold mb-4">Không tìm thấy sản phẩm nào</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {sanPham.map((sp) => (
                        <ProductCard key={sp.id} product={sp} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleFilterChange('page', filters.page - 1)}
                          disabled={filters.page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 font-medium text-gray-700 transition-colors disabled:hover:bg-white"
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
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  filters.page === page
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === filters.page - 2 || page === filters.page + 2) {
                            return <span key={page} className="px-2 text-gray-500">...</span>;
                          }
                          return null;
                        })}
                        <button
                          onClick={() => handleFilterChange('page', filters.page + 1)}
                          disabled={filters.page === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 font-medium text-gray-700 transition-colors disabled:hover:bg-white"
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
