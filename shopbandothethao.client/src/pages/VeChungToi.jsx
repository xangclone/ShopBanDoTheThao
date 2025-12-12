import { Link } from 'react-router-dom';
import { 
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineChat,
  HiOutlineFlag,
  HiOutlineEye,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlineCash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineGlobe,
  HiOutlineHeart,
  HiOutlineLightningBolt,
  HiOutlineArrowUp
} from 'react-icons/hi';

function VeChungToi() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Đồng hành cùng bạn trên mọi hành trình thể thao
            </p>
            <p className="text-lg text-blue-200 mt-4 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Chúng tôi không chỉ bán sản phẩm, mà còn mang đến cho bạn những trải nghiệm mua sắm tuyệt vời và dịch vụ chuyên nghiệp
            </p>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Chúng Tôi Là Ai?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Địa chỉ tin cậy hàng đầu trong việc cung cấp các sản phẩm thể thao chất lượng cao
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-lg mb-6">
                  <strong className="text-blue-600">Shop Bán Đồ Thể Thao</strong> là địa chỉ tin cậy hàng đầu 
                  trong việc cung cấp các sản phẩm thể thao chất lượng cao cho mọi người yêu thích vận động 
                  và lối sống lành mạnh. Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác 
                  của các thương hiệu thể thao hàng đầu thế giới.
                </p>
                <p className="text-lg mb-6">
                  Chúng tôi không chỉ bán sản phẩm, mà còn mang đến cho khách hàng những trải nghiệm mua sắm 
                  tuyệt vời, tư vấn chuyên nghiệp và dịch vụ hậu mãi tận tâm. Mỗi sản phẩm tại cửa hàng của 
                  chúng tôi đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng và tính chính hãng.
                </p>
                <p className="text-lg">
                  Với đội ngũ nhân viên nhiệt tình, am hiểu về thể thao và sức khỏe, chúng tôi cam kết đồng hành 
                  cùng bạn trong mọi hành trình thể thao, từ những bước chạy đầu tiên đến những thành tích cao nhất.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center shadow-lg">
                  <HiOutlineShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Chính Hãng</h3>
                  <p className="text-sm text-gray-600">100% hàng chính hãng</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center shadow-lg">
                  <HiOutlineStar className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Chất Lượng</h3>
                  <p className="text-sm text-gray-600">Đảm bảo chất lượng</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center shadow-lg">
                  <HiOutlineTruck className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Giao Hàng</h3>
                  <p className="text-sm text-gray-600">Nhanh chóng, an toàn</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center shadow-lg">
                  <HiOutlineChat className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">Hỗ Trợ</h3>
                  <p className="text-sm text-gray-600">24/7 tư vấn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thống kê */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                number: '10+', 
                label: 'Năm kinh nghiệm', 
                icon: HiOutlineCalendar,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              { 
                number: '50K+', 
                label: 'Khách hàng hài lòng', 
                icon: HiOutlineUserGroup,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
              },
              { 
                number: '1000+', 
                label: 'Sản phẩm đa dạng', 
                icon: HiOutlineCube,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-100'
              },
              { 
                number: '24/7', 
                label: 'Hỗ trợ khách hàng', 
                icon: HiOutlineChat,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4`}>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sứ mệnh & Tầm nhìn */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Sứ mệnh */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-6">
                <HiOutlineFlag className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Sứ Mệnh</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm thể thao chính hãng, chất lượng tốt nhất 
                với giá cả hợp lý. Góp phần thúc đẩy phong trào thể thao, nâng cao sức khỏe cộng đồng và lan tỏa 
                tinh thần thể thao tích cực đến mọi người.
              </p>
            </div>

            {/* Tầm nhìn */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white mb-6">
                <HiOutlineEye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Tầm Nhìn</h3>
              <p className="text-gray-700 leading-relaxed">
                Trở thành cửa hàng thể thao hàng đầu Việt Nam, được khách hàng tin tưởng và yêu mến. 
                Mở rộng mạng lưới cửa hàng trên toàn quốc, phục vụ hàng triệu khách hàng và trở thành 
                thương hiệu thể thao uy tín nhất trong khu vực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Giá Trị Cốt Lõi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những giá trị này định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: HiOutlineStar,
                title: 'Chất Lượng',
                description: 'Chỉ cung cấp sản phẩm chính hãng, chất lượng cao từ các thương hiệu uy tín',
                color: 'from-yellow-400 to-orange-500',
                bgColor: 'bg-yellow-50',
                iconColor: 'text-yellow-600'
              },
              {
                icon: HiOutlineUser,
                title: 'Uy Tín',
                description: 'Đặt lợi ích khách hàng lên hàng đầu, minh bạch trong mọi giao dịch',
                color: 'from-blue-400 to-cyan-500',
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600'
              },
              {
                icon: HiOutlineSparkles,
                title: 'Dịch Vụ',
                description: 'Phục vụ tận tâm, chuyên nghiệp với đội ngũ nhân viên được đào tạo bài bản',
                color: 'from-purple-400 to-pink-500',
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600'
              },
              {
                icon: HiOutlineCash,
                title: 'Giá Cả',
                description: 'Cạnh tranh, minh bạch với nhiều chương trình ưu đãi hấp dẫn',
                color: 'from-green-400 to-emerald-500',
                bgColor: 'bg-green-50',
                iconColor: 'text-green-600'
              },
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${value.bgColor} mb-4`}>
                    <IconComponent className={`w-7 h-7 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lịch sử phát triển */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hành Trình Phát Triển
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-indigo-300 to-purple-200 transform md:-translate-x-1/2"></div>
              
              {[
                { 
                  year: '2014', 
                  title: 'Thành lập', 
                  description: 'Shop Bán Đồ Thể Thao được thành lập với cửa hàng đầu tiên tại Hà Nội',
                  icon: HiOutlineLightningBolt
                },
                { 
                  year: '2017', 
                  title: 'Mở rộng', 
                  description: 'Mở thêm 5 cửa hàng tại các thành phố lớn và ra mắt website thương mại điện tử',
                  icon: HiOutlineTrendingUp
                },
                { 
                  year: '2020', 
                  title: 'Đổi mới', 
                  description: 'Nâng cấp hệ thống, mở rộng danh mục sản phẩm và cải thiện dịch vụ khách hàng',
                  icon: HiOutlineGlobe
                },
                { 
                  year: '2024', 
                  title: 'Hiện tại', 
                  description: 'Trở thành một trong những cửa hàng thể thao hàng đầu với hơn 50K khách hàng thân thiết',
                  icon: HiOutlineHeart
                },
              ].map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div
                    key={index}
                    className={`relative mb-12 flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-600">{milestone.year}</div>
                        </div>
                        <div className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</div>
                        <div className="text-gray-600">{milestone.description}</div>
                      </div>
                    </div>
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>
                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Cam kết dịch vụ */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cam Kết Của Chúng Tôi</h2>
            <p className="text-blue-100 mb-12 max-w-2xl mx-auto">
              Những cam kết không thể thay đổi trong mọi hoạt động của chúng tôi
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: HiOutlineCheckCircle, 
                  title: 'Sản phẩm chính hãng', 
                  description: '100% hàng chính hãng, có giấy tờ đầy đủ',
                  bgColor: 'bg-white/10'
                },
                { 
                  icon: HiOutlineTruck, 
                  title: 'Giao hàng nhanh', 
                  description: 'Miễn phí vận chuyển cho đơn hàng trên 500K',
                  bgColor: 'bg-white/10'
                },
                { 
                  icon: HiOutlineRefresh, 
                  title: 'Đổi trả dễ dàng', 
                  description: 'Chính sách đổi trả linh hoạt trong 7 ngày',
                  bgColor: 'bg-white/10'
                },
              ].map((commitment, index) => {
                const IconComponent = commitment.icon;
                return (
                  <div
                    key={index}
                    className={`${commitment.bgColor} backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300`}
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{commitment.title}</h3>
                    <p className="text-blue-100 text-sm">{commitment.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Liên hệ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Liên Hệ Với Chúng Tôi
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: HiOutlineMail,
                  title: 'Email',
                  content: 'info@shopbandothethao.com',
                  link: 'mailto:info@shopbandothethao.com',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'bg-blue-50',
                  iconColor: 'text-blue-600'
                },
                {
                  icon: HiOutlinePhone,
                  title: 'Hotline',
                  content: '1900-XXXX',
                  link: 'tel:1900XXXX',
                  color: 'from-green-500 to-emerald-500',
                  bgColor: 'bg-green-50',
                  iconColor: 'text-green-600'
                },
                {
                  icon: HiOutlineLocationMarker,
                  title: 'Địa chỉ',
                  content: '123 Đường ABC, Quận XYZ, TP. Hà Nội',
                  link: '#',
                  color: 'from-purple-500 to-pink-500',
                  bgColor: 'bg-purple-50',
                  iconColor: 'text-purple-600'
                },
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.link}
                    className="block bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${contact.bgColor} mb-4`}>
                      <IconComponent className={`w-7 h-7 ${contact.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.title}</h3>
                    <p className="text-gray-600">{contact.content}</p>
                  </a>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Khám Phá Sản Phẩm Ngay
                <HiOutlineArrowUp className="w-5 h-5 rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VeChungToi;
