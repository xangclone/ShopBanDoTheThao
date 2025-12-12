import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { 
  HiOutlineHome, 
  HiOutlineChartBar,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineTicket,
  HiOutlineLightningBolt,
  HiOutlinePhotograph,
  HiOutlineChat,
  HiOutlineNewspaper,
  HiOutlineStar,
  HiOutlineBell,
  HiOutlineGift,
  HiOutlineSparkles,
  HiOutlineCollection,
  HiOutlineFolder,
  HiOutlineLogout
} from 'react-icons/hi';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getUser();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: HiOutlineChartBar,
      items: [
        { path: '/admin', label: 'Dashboard', icon: HiOutlineChartBar },
      ]
    },
    {
      id: 'products',
      label: 'Sản phẩm',
      icon: HiOutlineCube,
      items: [
        { path: '/admin/san-pham', label: 'Sản phẩm & Biến thể', icon: HiOutlineCube },
        { path: '/admin/danh-muc', label: 'Danh mục', icon: HiOutlineFolder },
        { path: '/admin/thuong-hieu', label: 'Thương hiệu', icon: HiOutlineTag },
        { path: '/admin/danh-gia', label: 'Đánh giá', icon: HiOutlineStar },
      ]
    },
    {
      id: 'orders',
      label: 'Đơn hàng',
      icon: HiOutlineShoppingBag,
      items: [
        { path: '/admin/don-hang', label: 'Quản lý đơn hàng', icon: HiOutlineShoppingBag },
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: HiOutlineTicket,
      items: [
        { path: '/admin/ma-giam-gia', label: 'Mã giảm giá', icon: HiOutlineTicket },
        { path: '/admin/flash-sale', label: 'Flash Sale', icon: HiOutlineLightningBolt },
        { path: '/admin/banner', label: 'Banner', icon: HiOutlinePhotograph },
        { path: '/admin/popup', label: 'Popup', icon: HiOutlineChat },
      ]
    },
    {
      id: 'content',
      label: 'Nội dung',
      icon: HiOutlineNewspaper,
      items: [
        { path: '/admin/tin-tuc', label: 'Tin tức', icon: HiOutlineNewspaper },
      ]
    },
    {
      id: 'system',
      label: 'Hệ thống',
      icon: HiOutlineUsers,
      items: [
        { path: '/admin/nguoi-dung', label: 'Người dùng', icon: HiOutlineUsers },
        { path: '/admin/hang-vip', label: 'Hạng VIP', icon: HiOutlineStar },
        { path: '/admin/voucher-doi-diem', label: 'Voucher đổi điểm', icon: HiOutlineGift },
        { path: '/admin/lich-su-diem', label: 'Lịch sử điểm', icon: HiOutlineCollection },
        { path: '/admin/minigame', label: 'Minigame', icon: HiOutlineSparkles },
        { path: '/admin/chat', label: 'Chat', icon: HiOutlineChat },
        { path: '/admin/thong-bao', label: 'Thông báo', icon: HiOutlineBell },
      ]
    },
  ];

  const [expandedGroups, setExpandedGroups] = useState(() => {
    // Load từ localStorage hoặc mặc định
    const saved = localStorage.getItem('adminMenuExpanded');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Nếu parse lỗi, dùng mặc định
      }
    }
    return {
      dashboard: true,
      products: true,
      orders: true,
      marketing: false,
      content: false,
      system: false,
    };
  });

  // Tự động mở group có item đang active
  useEffect(() => {
    menuGroups.forEach(group => {
      if (group.items.some(item => isActive(item.path))) {
        setExpandedGroups(prev => ({
          ...prev,
          [group.id]: true
        }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (group) => {
    setExpandedGroups(prev => {
      const newState = {
        ...prev,
        [group]: !prev[group]
      };
      // Lưu vào localStorage
      localStorage.setItem('adminMenuExpanded', JSON.stringify(newState));
      return newState;
    });
  };

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
      <div className="w-72 backdrop-blur-xl bg-white/20 border-r border-white/30 shadow-2xl flex flex-col relative z-10">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">{user?.ho} {user?.ten}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isGroupExpanded = expandedGroups[group.id];
            const hasActiveItem = group.items.some(item => isActive(item.path));

            return (
              <div key={group.id} className="mb-2">
                {group.items.length > 1 ? (
                  <>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
                        hasActiveItem
                          ? 'bg-white/30 text-indigo-700 font-semibold'
                          : 'text-gray-700 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GroupIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">{group.label}</span>
                      </div>
                      {isGroupExpanded ? (
                        <HiChevronDown className="w-4 h-4" />
                      ) : (
                        <HiChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isGroupExpanded && (
                      <div className="ml-4 pl-4 border-l-2 border-white/20 space-y-1">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-white/40 backdrop-blur-md text-indigo-700 font-semibold shadow-md border border-white/50'
                                  : 'text-gray-600 hover:bg-white/25 hover:text-gray-800'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={group.items[0].path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive(group.items[0].path)
                        ? 'bg-white/40 backdrop-blur-md text-indigo-700 font-semibold shadow-md border border-white/50'
                        : 'text-gray-700 hover:bg-white/25'
                    }`}
                  >
                    <GroupIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{group.items[0].label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-white/25 transition-all duration-200 text-sm font-medium"
          >
            <HiOutlineHome className="w-5 h-5" />
            <span>Về trang chủ</span>
          </Link>
          <button
            onClick={handleDangXuat}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-white/25 transition-all duration-200 text-sm font-medium"
          >
            <HiOutlineLogout className="w-5 h-5" />
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

