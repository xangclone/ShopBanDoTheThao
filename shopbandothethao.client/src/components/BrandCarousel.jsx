import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

function BrandCarousel({ brands, title, subtitle }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [brands]);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title || 'Thương hiệu'}
          </h2>
          {subtitle && <p className="text-gray-600 text-lg md:text-xl font-medium">{subtitle}</p>}
        </div>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {brands.map((brand, index) => (
              <Link
                key={brand.id}
                to={`/san-pham?thuongHieuId=${brand.id}`}
                className="flex-shrink-0 group bg-white/80 backdrop-blur-md rounded-3xl p-5 md:p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 animate-scale-in w-44 md:w-52 border-2 border-blue-100/50 hover:border-blue-300/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-5 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110 shadow-lg p-3">
                  {brand.logo ? (
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={brand.ten}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  {!brand.logo && (
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-base md:text-lg lg:text-xl line-clamp-2">
                  {brand.ten}
                </h3>
              </Link>
            ))}
          </div>

          {/* Navigation Buttons */}
          {brands.length > 4 && (
            <>
              {/* Left Button */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-all transform hover:scale-110 border-2 border-blue-100/50 ${
                  canScrollLeft ? 'opacity-100 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Button */}
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-all transform hover:scale-110 border-2 border-blue-100/50 ${
                  canScrollRight ? 'opacity-100 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-blue-50 via-blue-50/50 to-transparent pointer-events-none z-0"></div>
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-blue-50 via-blue-50/50 to-transparent pointer-events-none z-0"></div>
        </div>
      </div>
    </section>
  );
}

export default BrandCarousel;



