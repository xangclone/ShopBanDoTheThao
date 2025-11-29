import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getUser();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/san-pham', label: 'Quản lý sản phẩm', icon: '📦' },
    { path: '/admin/kho', label: 'Quản lý kho', icon: '📋' },
    { path: '/admin/don-hang', label: 'Quản lý đơn hàng', icon: '🛒' },
    { path: '/admin/nguoi-dung', label: 'Quản lý người dùng', icon: '👥' },
    { path: '/admin/danh-muc', label: 'Quản lý danh mục', icon: '📁' },
    { path: '/admin/thuong-hieu', label: 'Quản lý thương hiệu', icon: '🏷️' },
    { path: '/admin/ma-giam-gia', label: 'Mã giảm giá', icon: '🎫' },
    { path: '/admin/flash-sale', label: 'Quản lý Flash Sale', icon: '⚡' },
    { path: '/admin/banner', label: 'Quản lý Banner', icon: '🖼️' },
    { path: '/admin/popup', label: 'Quản lý Popup', icon: '💬' },
    { path: '/admin/tin-tuc', label: 'Quản lý Tin tức', icon: '📰' },
    { path: '/admin/danh-gia', label: 'Quản lý Đánh giá', icon: '⭐' },
    { path: '/admin/chat', label: 'Quản lý Chat', icon: '💬' },
    { path: '/admin/thong-bao', label: 'Quản lý Thông báo', icon: '🔔' },
  ];

  const handleDangXuat = () => {
    authService.dangXuat();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar - Glassmorphism */}
      <div className="w-64 backdrop-blur-xl bg-white/20 border-r border-white/30 shadow-2xl flex flex-col relative z-10">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-700 mt-1 font-medium">{user?.ho} {user?.ten}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white/40 backdrop-blur-md text-indigo-700 font-semibold shadow-lg border border-white/50'
                  : 'text-gray-700 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-md border border-transparent hover:border-white/30'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-md mb-2 transition-all duration-300 border border-transparent hover:border-white/30"
          >
            <span className="text-xl">🏠</span>
            <span>Về trang chủ</span>
          </Link>
          <button
            onClick={handleDangXuat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-md transition-all duration-300 border border-transparent hover:border-white/30"
          >
            <span className="text-xl">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content - Glassmorphism */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl border border-white/40 min-h-full p-6">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;

