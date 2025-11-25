import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

function CategoryCarousel({ categories, title, subtitle }) {
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
  }, [categories]);

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

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {title || 'Loại sản phẩm'}
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
            {categories.map((dm, index) => (
              <Link
                key={dm.id}
                to={`/san-pham?danhMucId=${dm.id}`}
                className="flex-shrink-0 group bg-white/80 backdrop-blur-md rounded-3xl p-5 md:p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 animate-scale-in w-44 md:w-52 border-2 border-pink-100/50 hover:border-pink-300/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-5 bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl flex items-center justify-center group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                  {dm.hinhAnh ? (
                    <img
                      src={getImageUrl(dm.hinhAnh)}
                      alt={dm.ten}
                      className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  {!dm.hinhAnh && (
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-pink-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-base md:text-lg lg:text-xl line-clamp-2">
                  {dm.ten}
                </h3>
              </Link>
            ))}
          </div>

          {/* Navigation Buttons */}
          {categories.length > 4 && (
            <>
              {/* Left Button */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 transition-all transform hover:scale-110 border-2 border-pink-100/50 ${
                  canScrollLeft ? 'opacity-100 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Button */}
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 transition-all transform hover:scale-110 border-2 border-pink-100/50 ${
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
          <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-pink-50 via-pink-50/50 to-transparent pointer-events-none z-0"></div>
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-pink-50 via-pink-50/50 to-transparent pointer-events-none z-0"></div>
        </div>
      </div>
    </section>
  );
}

export default CategoryCarousel;


