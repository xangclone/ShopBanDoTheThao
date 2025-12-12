import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanPhamService } from '../services/sanPhamService';
import { danhMucService } from '../services/danhMucService';
import { tinTucService } from '../services/tinTucService';
import { thuongHieuService } from '../services/thuongHieuService';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import BrandCarousel from '../components/BrandCarousel';
import FlashSaleBanner from '../components/FlashSaleBanner';
import { getImageUrl } from '../utils/imageUtils';
import { formatVietnamDate } from '../utils/dateUtils';
import { 
  HiOutlineArrowUp,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineGift,
  HiOutlineSparkles,
  HiOutlineNewspaper,
  HiOutlineClipboardList,
  HiOutlineBookOpen,
  HiOutlineCollection
} from 'react-icons/hi';

function TrangChu() {
  const [sanPhamNoiBat, setSanPhamNoiBat] = useState([]);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [sanPhamKhuyenMai, setSanPhamKhuyenMai] = useState([]);
  const [sanPhamMoi, setSanPhamMoi] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [danhMucFlat, setDanhMucFlat] = useState([]);
  const [thuongHieu, setThuongHieu] = useState([]);
  const [tinTuc, setTinTuc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [noiBat, banChay, khuyenMai, moi, categories, brands, news] = await Promise.all([
          sanPhamService.getNoiBat(8),
          sanPhamService.getBanChay(8),
          sanPhamService.getKhuyenMai(8),
          sanPhamService.getDanhSach({ page: 1, pageSize: 8, sortBy: 'NgayTao', sortOrder: 'desc' }),
          danhMucService.getDanhSach(),
          thuongHieuService.getDanhSach(),
          tinTucService.getNoiBat(6),
        ]);
        setSanPhamNoiBat(noiBat);
        setSanPhamBanChay(banChay);
        setSanPhamKhuyenMai(khuyenMai);
        setSanPhamMoi(moi?.data || moi || []);
        setDanhMuc(categories);
        
        // Tạo danh sách phẳng bao gồm cả danh mục cha và con
        const flatCategories = [];
        if (categories && Array.isArray(categories)) {
          categories.forEach(cat => {
            // Thêm danh mục cha
            flatCategories.push(cat);
            // Thêm các danh mục con nếu có
            if (cat.danhMucCon && Array.isArray(cat.danhMucCon) && cat.danhMucCon.length > 0) {
              flatCategories.push(...cat.danhMucCon);
            }
          });
        }
        setDanhMucFlat(flatCategories);
        
        setThuongHieu(brands || []);
        setTinTuc(news);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="relative inline-block">
            {/* Spinning Circle */}
            <div className="w-20 h-20 border-4 border-pink-200 rounded-full animate-spin border-t-pink-600 border-r-purple-600"></div>
            {/* Inner Pulse */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg animate-pulse">
            Đang tải trang chủ...
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner Carousel */}
      <section className="container mx-auto px-2 pt-3 pb-2 animate-fade-in">
        <BannerCarousel />
      </section>

      {/* Loại sản phẩm */}
      <CategoryCarousel
        categories={danhMucFlat}
        title="Loại sản phẩm"
        subtitle="Khám phá các danh mục đa dạng"
      />

      {/* Thương hiệu */}
      <BrandCarousel
        brands={thuongHieu}
        title="Thương hiệu nổi bật"
        subtitle="Các thương hiệu uy tín và chất lượng"
      />

      {/* Flash Sale Banner */}
      <FlashSaleBanner />

      {/* Sản phẩm bán chạy */}
      <ProductCarousel
        products={sanPhamBanChay}
        title={
          <span className="flex items-center gap-3">
            <HiOutlineFire className="w-8 h-8 text-red-600" />
            Sản phẩm bán chạy
          </span>
        }
        subtitle="Những sản phẩm được yêu thích nhất"
        viewAllLink="/san-pham?sortBy=SoLuongBan&sortOrder=desc"
        titleGradient="from-red-600 to-orange-600"
      />

      {/* Sản phẩm nổi bật */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="relative z-10">
          <ProductCarousel
            products={sanPhamNoiBat}
            title={
              <span className="flex items-center gap-3">
                <HiOutlineStar className="w-8 h-8 text-blue-600" />
                Sản phẩm nổi bật
              </span>
            }
            subtitle="Sản phẩm được chọn lọc kỹ lưỡng"
            viewAllLink="/san-pham?sanPhamNoiBat=true"
            titleGradient="from-blue-600 to-purple-600"
          />
        </div>
      </section>

      {/* Sản phẩm khuyến mãi */}
      <ProductCarousel
        products={sanPhamKhuyenMai}
        title={
          <span className="flex items-center gap-3">
            <HiOutlineGift className="w-8 h-8 text-red-600" />
            Sản phẩm khuyến mãi
          </span>
        }
        subtitle="Ưu đãi đặc biệt hôm nay"
        viewAllLink="/san-pham/khuyen-mai"
        titleGradient="from-red-600 to-pink-600"
      />

      {/* Sản phẩm mới */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-fuchsia-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
        </div>
        <div className="relative z-10">
          <ProductCarousel
            products={sanPhamMoi}
            title={
              <span className="flex items-center gap-3">
                <HiOutlineSparkles className="w-8 h-8 text-emerald-600" />
                Sản phẩm mới
              </span>
            }
            subtitle="Những sản phẩm mới nhất được thêm vào"
            viewAllLink="/san-pham?sortBy=NgayTao&sortOrder=desc"
            titleGradient="from-emerald-600 to-cyan-600"
          />
        </div>
      </section>

      {/* Tin tức */}
      <section className="bg-gradient-to-br from-lavender-50 via-purple-50 to-indigo-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12 animate-slide-in-right">
            <div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <HiOutlineNewspaper className="w-10 h-10 text-pink-600" />
                <span>Tin tức & Cẩm nang</span>
              </h2>
              <p className="text-gray-600 text-lg font-medium">Cập nhật mới nhất về thể thao</p>
            </div>
            <Link
              to="/tin-tuc"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold text-lg flex items-center gap-2 group hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Xem tất cả
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tinTuc.map((tt, index) => (
              <Link
                key={tt.id}
                to={`/tin-tuc/${tt.id}`}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 group animate-scale-in border-2 border-pink-100/50 hover:border-pink-300/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageUrl(tt.hinhAnh) || '/placeholder.jpg'}
                    alt={tt.tieuDe}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {tt.loai && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30 flex items-center gap-2">
                      {tt.loai === 'HuongDan' ? (
                        <>
                          <HiOutlineBookOpen className="w-4 h-4" />
                          Hướng dẫn
                        </>
                      ) : tt.loai === 'CamNang' ? (
                        <>
                          <HiOutlineCollection className="w-4 h-4" />
                          Cẩm nang
                        </>
                      ) : (
                        <>
                          <HiOutlineNewspaper className="w-4 h-4" />
                          Tin tức
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-pink-50/30">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {tt.tieuDe}
                  </h3>
                  {tt.tomTat && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {tt.tomTat}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-pink-100">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatVietnamDate(tt.ngayDang)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {tt.soLuotXem}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hướng dẫn mua hàng */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <HiOutlineClipboardList className="w-10 h-10 text-green-600" />
            <span>Hướng dẫn mua hàng</span>
          </h2>
          <p className="text-gray-600 text-lg">Mua sắm dễ dàng chỉ với 4 bước đơn giản</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              title: '1. Tìm kiếm sản phẩm',
              desc: 'Tìm kiếm sản phẩm bạn muốn mua',
              color: 'from-blue-100 to-blue-200',
              iconBg: 'bg-blue-100',
            },
            {
              icon: (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: '2. Thêm vào giỏ hàng',
              desc: 'Chọn size, màu và thêm vào giỏ',
              color: 'from-green-100 to-green-200',
              iconBg: 'bg-green-100',
            },
            {
              icon: (
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: '3. Thanh toán',
              desc: 'Chọn địa chỉ và phương thức thanh toán',
              color: 'from-yellow-100 to-yellow-200',
              iconBg: 'bg-yellow-100',
            },
            {
              icon: (
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: '4. Nhận hàng',
              desc: 'Nhận hàng và đánh giá sản phẩm',
              color: 'from-purple-100 to-purple-200',
              iconBg: 'bg-purple-100',
            },
          ].map((step, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-scale-in group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`w-20 h-20 ${step.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center group ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-0 pointer-events-none'
        }`}
        aria-label="Quay về đầu trang"
      >
        <HiOutlineArrowUp className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}

export default TrangChu;
