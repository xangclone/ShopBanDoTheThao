import { Link } from 'react-router-dom';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineBookOpen,
  HiOutlineRefresh,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineChat,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineGift,
  HiOutlineArrowRight
} from 'react-icons/hi';

function HoTroKhachHang() {
  const supportCategories = [
    {
      id: 'faq',
      title: 'Câu hỏi thường gặp',
      description: 'Tìm câu trả lời cho các câu hỏi phổ biến',
      icon: HiOutlineQuestionMarkCircle,
      link: '/ho-tro/faq',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'huong-dan',
      title: 'Hướng dẫn mua hàng',
      description: 'Các bước đặt hàng và thanh toán đơn giản',
      icon: HiOutlineBookOpen,
      link: '/ho-tro/huong-dan-mua-hang',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'doi-tra',
      title: 'Chính sách đổi trả',
      description: 'Quy định về đổi trả và hoàn tiền',
      icon: HiOutlineRefresh,
      link: '/ho-tro/chinh-sach-doi-tra',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'van-chuyen',
      title: 'Chính sách vận chuyển',
      description: 'Thông tin về phí ship và thời gian giao hàng',
      icon: HiOutlineTruck,
      link: '/ho-tro/chinh-sach-van-chuyen',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'thanh-toan',
      title: 'Hướng dẫn thanh toán',
      description: 'Các phương thức thanh toán được hỗ trợ',
      icon: HiOutlineCreditCard,
      link: '/ho-tro/huong-dan-thanh-toan',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 'lien-he',
      title: 'Liên hệ với chúng tôi',
      description: 'Gửi yêu cầu hỗ trợ hoặc phản hồi',
      icon: HiOutlineChat,
      link: '/ho-tro/lien-he',
      color: 'from-red-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Hỗ trợ khách hàng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Tìm kiếm thông tin hoặc liên hệ với chúng tôi để được giải đáp.
          </p>
        </div>

        {/* Support Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {supportCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={category.link}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-pink-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Xem chi tiết</span>
                  <HiOutlineArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Contact */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Cần hỗ trợ ngay?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlinePhone className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Hotline</h3>
                <p className="text-white/90 mb-2">1900-xxxx</p>
                <p className="text-sm text-white/80">24/7 hỗ trợ</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineMail className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-white/90 mb-2">support@shopbandothethao.com</p>
                <p className="text-sm text-white/80">Phản hồi trong 24h</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineClock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Giờ làm việc</h3>
                <p className="text-white/90 mb-2">8:00 - 22:00</p>
                <p className="text-sm text-white/80">Tất cả các ngày trong tuần</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/ho-tro/lien-he"
                className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <HiOutlineChat className="w-5 h-5" />
                <span>Gửi yêu cầu hỗ trợ</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi phổ biến</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Làm thế nào để đặt hàng?',
                a: 'Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.'
              },
              {
                q: 'Thời gian giao hàng là bao lâu?',
                a: 'Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào địa chỉ nhận hàng.'
              },
              {
                q: 'Có thể đổi trả sản phẩm không?',
                a: 'Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn.'
              }
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-pink-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-1">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/ho-tro/faq"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-purple-600 font-semibold transition-colors"
            >
              <span>Xem tất cả câu hỏi</span>
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoTroKhachHang;

