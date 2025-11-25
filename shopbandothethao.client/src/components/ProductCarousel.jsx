import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

function ProductCarousel({ products, title, subtitle, viewAllLink, titleGradient = 'from-blue-600 to-indigo-600' }) {
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
  }, [products]);

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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16 relative">
      <div className="flex items-center justify-between mb-12 animate-slide-in-left">
        <div>
          <h2 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 text-lg font-medium">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold text-lg flex items-center gap-2 group hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Xem tất cả
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="relative group">
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-72 animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {products.length > 4 && (
          <>
            {/* Left Button */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 transition-all transform hover:scale-110 border-2 border-pink-100/50 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-100 transition-all transform hover:scale-110 border-2 border-pink-100/50 ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-white/60 via-white/30 to-transparent pointer-events-none z-0"></div>
        <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white/60 via-white/30 to-transparent pointer-events-none z-0"></div>
      </div>
    </section>
  );
}

export default ProductCarousel;

