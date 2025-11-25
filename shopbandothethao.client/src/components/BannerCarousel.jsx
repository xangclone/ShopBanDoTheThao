import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerService } from '../services/bannerService';
import { getImageUrl } from '../utils/imageUtils';

function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Chuyển slide mỗi 5 giây

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      const data = await bannerService.getBanner();
      setBanners(data);
    } catch (error) {
      console.error('Lỗi khi tải banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="w-full h-72 md:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-2xl shadow-2xl mb-12 group">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative flex items-center justify-center"
          >
            {banner.lienKet ? (
              <Link to={banner.lienKet} className="absolute inset-0 z-10">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={getImageUrl(banner.hinhAnh)}
                    alt={banner.tieuDe}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              </Link>
            ) : (
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={getImageUrl(banner.hinhAnh)}
                  alt={banner.tieuDe}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all z-20 transform hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all z-20 transform hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-10 bg-white shadow-lg'
                  : 'w-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BannerCarousel;

