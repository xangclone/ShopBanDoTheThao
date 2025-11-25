import { useState } from 'react';
import { getImageUrl } from '../utils/imageUtils';

function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = true,
  ...props 
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e) => {
    setHasError(true);
    setIsLoading(false);
    e.target.style.display = 'none';
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    // Tách className để lấy kích thước container
    const containerClasses = className.split(' ').filter(c => 
      c.startsWith('w-') || c.startsWith('h-') || c.startsWith('object-') || c.startsWith('rounded')
    ).join(' ');
    
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${containerClasses || className}`}>
        <div className="flex flex-col items-center justify-center text-gray-400">
          <svg 
            className="w-8 h-8 md:w-12 md:h-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-xs mt-1 text-gray-500 hidden md:block">Không có hình ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={getImageUrl(src)}
        alt={alt || 'Sản phẩm'}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </div>
  );
}

export default ImageWithFallback;

