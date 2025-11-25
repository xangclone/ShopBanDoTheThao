// Utility function để xử lý URL hình ảnh
const SERVER_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5066';

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder.jpg';
  }

  // Nếu đã là full URL (http/https), trả về trực tiếp
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Nếu bắt đầu bằng /, thêm base URL
  if (imagePath.startsWith('/')) {
    return `${SERVER_BASE_URL}${imagePath}`;
  }

  // Nếu không có /, thêm /uploads/
  return `${SERVER_BASE_URL}/uploads/${imagePath}`;
};


