import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { sanPhamService } from '../../services/sanPhamService';
import { gioHangService } from '../../services/gioHangService';
import diemService from '../../services/diemService';
import SidebarPopup from '../SidebarPopup';
import AuthModal from '../AuthModal';
import NotificationBell from '../NotificationBell';
import { useState, useEffect, useRef } from 'react';
import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch, HiOutlineChevronDown, HiOutlineMenu, HiOutlineX, HiOutlineArrowRight, HiOutlineStar, HiOutlineGift, HiOutlineSparkles } from 'react-icons/hi';
import { getImageUrl } from '../../utils/imageUtils';
import ImageWithFallback from '../ImageWithFallback';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [gioHangCount, setGioHangCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState('gioHang');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [thongTinDiem, setThongTinDiem] = useState(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    if (currentUser) {
      loadGioHangCount();
      loadThongTinDiem();
    }

    // Kiểm tra nếu cần mở popup đăng nhập sau khi reset mật khẩu
    const openLoginModal = localStorage.getItem('openLoginModal');
    if (openLoginModal === 'true') {
      localStorage.removeItem('openLoginModal');
      setAuthModalOpen(true);
    }
  }, []);

  const loadThongTinDiem = async () => {
    try {
      const data = await diemService.getThongTinDiem();
      setThongTinDiem(data);
    } catch (error) {
      // Ignore error if not authenticated
    }
  };

  useEffect(() => {
    // Đóng kết quả tìm kiếm khi click bên ngoài
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Chỉ đóng nếu không click vào kết quả tìm kiếm
        const isClickOnResult = event.target.closest('[data-search-result]');
        if (!isClickOnResult) {
          setShowSearchResults(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadGioHangCount = async () => {
    try {
      const data = await gioHangService.getGioHang();
      setGioHangCount(data?.length || 0);
    } catch (error) {
      // Ignore error if not authenticated
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Hiển thị gợi ý ngay khi có 1 ký tự
    if (query.trim().length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Tìm kiếm với limit lớn hơn để có nhiều gợi ý
        const results = await sanPhamService.timKiem(query, 8);
        setSearchResults(results || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        setSearchResults([]);
      }
    }, 200); // Giảm delay để phản hồi nhanh hơn
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/san-pham?timKiem=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleDangXuat = () => {
    authService.dangXuat();
    setUser(null);
    navigate('/');
    setGioHangCount(0);
  };

  const openSidebar = (type) => {
    setSidebarType(type);
    setSidebarOpen(true);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/30">
        <div className="container mx-auto px-4">
          {/* Top bar với logo và menu */}
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">
                Tài Khùm
              </span>
            </Link>

            {/* Menu Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-shrink-0">
              <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium transition-all duration-300 hover:scale-105 relative group">
                Trang chủ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/san-pham" className="text-gray-700 hover:text-pink-600 font-medium transition-all duration-300 hover:scale-105 relative group">
                Sản phẩm
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/tin-tuc" className="text-gray-700 hover:text-pink-600 font-medium transition-all duration-300 hover:scale-105 relative group">
                Tin tức
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/ve-chung-toi" className="text-gray-700 hover:text-pink-600 font-medium transition-all duration-300 hover:scale-105 relative group">
                Về chúng tôi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Thanh tìm kiếm */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 1 && searchResults.length > 0 && setShowSearchResults(true)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-5 py-3 pr-12 border-2 border-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-300"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </form>

              {/* Kết quả tìm kiếm */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border-2 border-pink-100/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-[100]">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-2 mb-1">
                      Gợi ý sản phẩm ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        data-search-result
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const productId = product.id;
                          setShowSearchResults(false);
                          setSearchQuery('');
                          navigate(`/san-pham/${productId}`);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 border-b border-pink-100/50 last:border-b-0 cursor-pointer transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden border-2 border-pink-100 shadow-md group-hover:shadow-lg transition-all duration-300">
                          <ImageWithFallback
                            src={getImageUrl(product.hinhAnhChinh)}
                            alt={product.ten}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 group-hover:text-pink-600 truncate transition-colors">
                            {product.ten}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-pink-600 font-bold text-sm">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(product.gia)}
                            </p>
                            {product.giaGoc && product.giaGoc > product.gia && (
                              <span className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(product.giaGoc)}
                              </span>
                            )}
                          </div>
                        </div>
                        <HiOutlineArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 flex-shrink-0 transition-colors" />
                      </div>
                    ))}
                    {searchResults.length >= 8 && (
                      <div
                        data-search-result
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowSearchResults(false);
                          navigate(`/san-pham?timKiem=${encodeURIComponent(searchQuery)}`);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 cursor-pointer transition-all duration-300 mt-2"
                      >
                        <span className="text-sm font-semibold text-pink-600">Xem tất cả kết quả</span>
                        <HiOutlineArrowRight className="w-4 h-4 text-pink-600" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Hiển thị khi không có kết quả nhưng đang tìm kiếm */}
              {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border-2 border-pink-100/50 rounded-2xl shadow-2xl p-6 z-[100]">
                  <div className="text-center">
                    <HiOutlineSearch className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào</p>
                    <p className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                </div>
              )}
            </div>

            {/* Icons và Menu */}
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              {/* Icon Thông báo */}
              {user && (
                <NotificationBell />
              )}

              {/* Icon Yêu thích */}
              {user && (
                <button
                  onClick={() => openSidebar('yeuThich')}
                  className="relative p-3 hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  title="Yêu thích"
                >
                  <HiOutlineHeart className="w-6 h-6 text-pink-600" />
                </button>
              )}

              {/* Icon Giỏ hàng */}
              {user && (
                <button
                  onClick={() => openSidebar('gioHang')}
                  className="relative p-3 hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  title="Giỏ hàng"
                >
                  <HiOutlineShoppingCart className="w-6 h-6 text-purple-600" />
                  {gioHangCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {gioHangCount > 9 ? '9+' : gioHangCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 px-3 md:px-4 py-2 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-2xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {user.ho?.[0]?.toUpperCase() || user.ten?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:inline font-medium text-gray-700">{user.ho} {user.ten}</span>
                    <HiOutlineChevronDown className="w-4 h-4 hidden md:inline text-gray-600" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-pink-100 py-2 z-50 overflow-hidden">
                      {/* Thông tin điểm và hạng VIP */}
                      {thongTinDiem && (
                        <div className="px-5 py-3 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Điểm khả dụng</span>
                            <span className="text-lg font-bold text-pink-600">
                              {thongTinDiem.diemKhaDung.toLocaleString('vi-VN')}
                            </span>
                          </div>
                          {thongTinDiem.hangVip && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{thongTinDiem.hangVip.icon || '⭐'}</span>
                              <span className="text-sm font-semibold text-gray-700">
                                {thongTinDiem.hangVip.ten}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <Link
                        to="/tai-khoan"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-gray-700 font-medium"
                      >
                        <HiOutlineUser className="w-5 h-5" />
                        Tài khoản
                      </Link>
                      <Link
                        to="/tich-diem"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-gray-700 font-medium"
                      >
                        <HiOutlineStar className="w-5 h-5" />
                        Tích điểm
                      </Link>
                      <Link
                        to="/doi-voucher"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-gray-700 font-medium"
                      >
                        <HiOutlineGift className="w-5 h-5" />
                        Đổi voucher
                      </Link>
                      <Link
                        to="/minigame"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-gray-700 font-medium"
                      >
                        <HiOutlineSparkles className="w-5 h-5" />
                        Minigame
                      </Link>
                      <Link
                        to="/don-hang"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-gray-700 font-medium"
                      >
                        <HiOutlineShoppingCart className="w-5 h-5" />
                        Đơn hàng
                      </Link>
                      <button
                        onClick={handleDangXuat}
                        className="flex items-center gap-2 w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 text-red-600 font-medium"
                      >
                        <HiOutlineX className="w-5 h-5" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="p-3 hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  title="Đăng nhập / Đăng ký"
                >
                  <HiOutlineUser className="w-6 h-6 text-purple-600" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden border-t border-pink-100 pt-3 pb-3">
            <nav className="flex items-center justify-around">
              <Link to="/" className="text-sm hover:text-pink-600 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50">
                Trang chủ
              </Link>
              <Link to="/san-pham" className="text-sm hover:text-pink-600 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50">
                Sản phẩm
              </Link>
              <Link to="/tin-tuc" className="text-sm hover:text-pink-600 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50">
                Tin tức
              </Link>
              <Link to="/ve-chung-toi" className="text-sm hover:text-pink-600 font-medium transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-pink-50">
                Về chúng tôi
              </Link>
            </nav>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden border-t border-pink-100 pt-3 pb-3">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 1 && searchResults.length > 0 && setShowSearchResults(true)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 pr-10 border-2 border-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white/80 backdrop-blur-sm shadow-md"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-300"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </form>

              {/* Kết quả tìm kiếm mobile */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border-2 border-pink-100/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-[100]">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-2 mb-1">
                      Gợi ý sản phẩm ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        data-search-result
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const productId = product.id;
                          setShowSearchResults(false);
                          setSearchQuery('');
                          navigate(`/san-pham/${productId}`);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 border-b border-pink-100/50 last:border-b-0 cursor-pointer transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden border-2 border-pink-100 shadow-md">
                          <ImageWithFallback
                            src={getImageUrl(product.hinhAnhChinh)}
                            alt={product.ten}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 group-hover:text-pink-600 truncate transition-colors">
                            {product.ten}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-pink-600 font-bold text-sm">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(product.gia)}
                            </p>
                            {product.giaGoc && product.giaGoc > product.gia && (
                              <span className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(product.giaGoc)}
                              </span>
                            )}
                          </div>
                        </div>
                        <HiOutlineArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 flex-shrink-0 transition-colors" />
                      </div>
                    ))}
                    {searchResults.length >= 8 && (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowSearchResults(false);
                          navigate(`/san-pham?timKiem=${encodeURIComponent(searchQuery)}`);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 cursor-pointer transition-all duration-300 mt-2"
                      >
                        <span className="text-sm font-semibold text-pink-600">Xem tất cả kết quả</span>
                        <HiOutlineArrowRight className="w-4 h-4 text-pink-600" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Hiển thị khi không có kết quả mobile */}
              {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border-2 border-pink-100/50 rounded-2xl shadow-2xl p-6 z-[100]">
                  <div className="text-center">
                    <HiOutlineSearch className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium text-sm">Không tìm thấy sản phẩm nào</p>
                    <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Popup */}
      <SidebarPopup
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          if (user) {
            loadGioHangCount();
          }
        }}
        type={sidebarType}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          // Reload user state after successful login
          const currentUser = authService.getUser();
          if (currentUser) {
            setUser(currentUser);
            loadGioHangCount();
          }
        }}
      />
    </>
  );
}

export default Header;

