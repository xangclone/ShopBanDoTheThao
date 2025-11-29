import { Link } from 'react-router-dom';
import { HiOutlineEmojiSad, HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <HiOutlineEmojiSad className="w-32 h-32 text-pink-500 animate-bounce" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-pink-300 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
          404
        </h1>

        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Trang không tìm thấy
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <HiOutlineHome className="w-5 h-5" />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200 transform hover:scale-105"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-4">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;





