import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flashSaleService } from '../services/flashSaleService';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';
import { HiOutlineClock, HiOutlineFire, HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';

function FlashSaleBanner() {
  const [flashSales, setFlashSales] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    loadFlashSales();
  }, []);

  useEffect(() => {
    if (flashSales.length > 0) {
      // Cập nhật countdown cho tất cả flash sale
      const timers = flashSales.map(fs => {
        const interval = setInterval(() => {
          setTimeRemaining(prev => {
            const newTime = { ...prev };
            if (newTime[fs.id] > 0) {
              newTime[fs.id] = newTime[fs.id] - 1;
            } else {
              clearInterval(interval);
            }
            return newTime;
          });
        }, 1000);
        return interval;
      });

      return () => {
        timers.forEach(timer => clearInterval(timer));
      };
    }
  }, [flashSales]);

  const loadFlashSales = async () => {
    try {
      const data = await flashSaleService.getFlashSaleDangDienRa();
      if (data && data.length > 0) {
        setFlashSales(data);
        // Khởi tạo countdown cho mỗi flash sale
        const initialTimes = {};
        data.forEach(fs => {
          initialTimes[fs.id] = Math.max(0, Math.floor(fs.thoiGianConLai));
        });
        setTimeRemaining(initialTimes);
      }
    } catch (error) {
      console.error('Lỗi khi tải flash sale:', error);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (flashSales.length === 0) {
    return null;
  }

  const currentFlashSale = flashSales[currentIndex];

  return (
    <section className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Image */}
            {currentFlashSale.hinhAnh && (
              <div className="flex-shrink-0 w-full md:w-1/3">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30">
                  <ImageWithFallback
                    src={getImageUrl(currentFlashSale.hinhAnh)}
                    alt={currentFlashSale.ten}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Right: Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <HiOutlineFire className="w-8 h-8 text-yellow-300 animate-pulse" />
                <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                  Flash Sale
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {currentFlashSale.ten}
              </h2>

              {currentFlashSale.moTa && (
                <p className="text-white/90 mb-6 text-lg">
                  {currentFlashSale.moTa}
                </p>
              )}

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border-2 border-white/30">
                  <HiOutlineClock className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Còn lại</div>
                    <div className="text-3xl font-bold font-mono text-white">
                      {formatTime(timeRemaining[currentFlashSale.id])}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-white/90">
                  <span className="font-bold text-2xl">{currentFlashSale.soLuongSanPham}</span>
                  <span className="ml-2">sản phẩm đang sale</span>
                </div>
                <Link
                  to={`/flash-sale/${currentFlashSale.id}`}
                  className="flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span>Xem ngay</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Sản phẩm nổi bật */}
              {currentFlashSale.danhSachSanPham && currentFlashSale.danhSachSanPham.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-4 text-lg">Sản phẩm nổi bật</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {currentFlashSale.danhSachSanPham.map((sp) => {
                      const phanTramDaBan = sp.soLuongToiDa > 0 
                        ? Math.min(100, (sp.soLuongDaBan / sp.soLuongToiDa) * 100)
                        : 0;
                      return (
                        <Link
                          key={sp.id}
                          to={`/san-pham/${sp.id}`}
                          className="bg-white/10 backdrop-blur-md rounded-xl p-3 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 group"
                        >
                          <div className="relative mb-2">
                            <ImageWithFallback
                              src={getImageUrl(sp.hinhAnhChinh)}
                              alt={sp.ten}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{sp.phanTramGiam}%
                            </div>
                          </div>
                          <div className="text-white">
                            <h4 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-yellow-300 transition-colors">
                              {sp.ten}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-300 font-bold text-sm">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                  }).format(sp.giaFlashSale)}
                                </span>
                              </div>
                              <div className="text-xs text-white/70 line-through">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(sp.gia)}
                              </div>
                              {sp.soLuongToiDa > 0 && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-white/80">Đã bán</span>
                                    <span className="text-white font-semibold">
                                      {sp.soLuongDaBan}/{sp.soLuongToiDa}
                                    </span>
                                  </div>
                                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${phanTramDaBan}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Dots */}
          {flashSales.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {flashSales.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FlashSaleBanner;

