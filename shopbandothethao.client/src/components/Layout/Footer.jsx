import { Link } from 'react-router-dom';
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText, 
  HiOutlineBriefcase, 
  HiOutlineShieldCheck, 
  HiOutlineGift, 
  HiOutlineBookOpen, 
  HiOutlineRefresh, 
  HiOutlineTruck, 
  HiOutlineCreditCard, 
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineChat
} from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white mt-auto relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Shop Bán Đồ Thể Thao
            </h3>
            <p className="text-pink-100 mb-6 leading-relaxed">
              Chuyên cung cấp các sản phẩm thể thao chất lượng cao, uy tín và đáng tin cậy
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-pink-200 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-pink-200 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-pink-200 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 className="font-bold mb-6 text-xl text-white">Về chúng tôi</h4>
            <ul className="space-y-3 text-pink-100">
              <li>
                <Link to="/ve-chung-toi" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineSparkles className="w-5 h-5" />
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/tin-tuc" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineNewspaper className="w-5 h-5" />
                  Tin tức & Cẩm nang
                </Link>
              </li>
              <li>
                <a href="#tuyen-dung" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineBriefcase className="w-5 h-5" />
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#chinh-sach" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#dieu-khoan" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineDocumentText className="w-5 h-5" />
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h4 className="font-bold mb-6 text-xl text-white">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-pink-100">
              <li>
                <Link to="/san-pham/khuyen-mai" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineGift className="w-5 h-5" />
                  Sản phẩm khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineBookOpen className="w-5 h-5" />
                  Hỗ trợ khách hàng
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/huong-dan-mua-hang" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineBookOpen className="w-5 h-5" />
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/chinh-sach-doi-tra" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineRefresh className="w-5 h-5" />
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/chinh-sach-van-chuyen" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineTruck className="w-5 h-5" />
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/huong-dan-thanh-toan" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineCreditCard className="w-5 h-5" />
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/faq" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineQuestionMarkCircle className="w-5 h-5" />
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/ho-tro/lien-he" className="flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-2 font-medium">
                  <HiOutlineChat className="w-5 h-5" />
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-bold mb-6 text-xl text-white">Liên hệ</h4>
            <ul className="space-y-4 text-pink-100">
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                  <HiOutlineMail className="w-5 h-5 text-pink-200 group-hover:text-white" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">support@shopbandothethao.com</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                  <HiOutlinePhone className="w-5 h-5 text-pink-200 group-hover:text-white" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">Hotline: 1900-xxxx</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                  <HiOutlineLocationMarker className="w-5 h-5 text-pink-200 group-hover:text-white" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300">
                  <HiOutlineClock className="w-5 h-5 text-pink-200 group-hover:text-white" />
                </div>
                <span className="font-medium group-hover:text-white transition-colors">Thứ 2 - Chủ nhật: 8:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần dưới */}
        <div className="border-t border-pink-500/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-pink-200 text-sm font-medium">
              <p>&copy; 2024 Shop Bán Đồ Thể Thao. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-pink-200">
              <Link to="/ve-chung-toi" className="hover:text-white transition-all duration-300 hover:scale-105 font-medium">
                Về chúng tôi
              </Link>
              <span className="text-pink-400">|</span>
              <a href="#chinh-sach" className="hover:text-white transition-all duration-300 hover:scale-105 font-medium">
                Chính sách
              </a>
              <span className="text-pink-400">|</span>
              <a href="#dieu-khoan" className="hover:text-white transition-all duration-300 hover:scale-105 font-medium">
                Điều khoản
              </a>
              <span className="text-pink-400">|</span>
              <Link to="/tin-tuc" className="hover:text-white transition-all duration-300 hover:scale-105 font-medium">
                Tin tức
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



