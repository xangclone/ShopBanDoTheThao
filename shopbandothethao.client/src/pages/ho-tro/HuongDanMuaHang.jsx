import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineShoppingCart, HiOutlineCreditCard, HiOutlineTruck, HiOutlineCheckCircle } from 'react-icons/hi';

function HuongDanMuaHang() {
  const steps = [
    {
      number: 1,
      title: 'Tìm kiếm sản phẩm',
      description: 'Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục để tìm sản phẩm bạn muốn mua',
      icon: HiOutlineShoppingCart,
      details: [
        'Nhập tên sản phẩm vào ô tìm kiếm',
        'Lọc theo danh mục, thương hiệu, giá',
        'Xem chi tiết sản phẩm để biết thêm thông tin'
      ]
    },
    {
      number: 2,
      title: 'Chọn sản phẩm',
      description: 'Chọn size, màu sắc và số lượng sản phẩm phù hợp với bạn',
      icon: HiOutlineCheckCircle,
      details: [
        'Chọn size phù hợp (xem bảng size guide nếu cần)',
        'Chọn màu sắc yêu thích',
        'Chọn số lượng muốn mua',
        'Xem giá và thông tin khuyến mãi'
      ]
    },
    {
      number: 3,
      title: 'Thêm vào giỏ hàng',
      description: 'Thêm sản phẩm vào giỏ hàng và tiếp tục mua sắm hoặc thanh toán ngay',
      icon: HiOutlineShoppingCart,
      details: [
        'Click "Thêm vào giỏ hàng"',
        'Có thể tiếp tục mua sắm hoặc thanh toán ngay',
        'Kiểm tra giỏ hàng để xem lại các sản phẩm đã chọn'
      ]
    },
    {
      number: 4,
      title: 'Đăng nhập/Đăng ký',
      description: 'Đăng nhập vào tài khoản hoặc đăng ký tài khoản mới để tiếp tục',
      icon: HiOutlineCheckCircle,
      details: [
        'Nếu chưa có tài khoản, click "Đăng ký"',
        'Điền thông tin đầy đủ và xác nhận email',
        'Nếu đã có tài khoản, đăng nhập bằng email/mật khẩu',
        'Có thể đăng nhập bằng Google hoặc Facebook'
      ]
    },
    {
      number: 5,
      title: 'Nhập thông tin giao hàng',
      description: 'Điền địa chỉ nhận hàng và thông tin liên hệ',
      icon: HiOutlineTruck,
      details: [
        'Chọn địa chỉ đã lưu hoặc thêm địa chỉ mới',
        'Nhập đầy đủ: Họ tên, Số điện thoại, Địa chỉ',
        'Kiểm tra lại thông tin trước khi tiếp tục'
      ]
    },
    {
      number: 6,
      title: 'Chọn phương thức thanh toán',
      description: 'Chọn cách thanh toán phù hợp với bạn',
      icon: HiOutlineCreditCard,
      details: [
        'Thanh toán khi nhận hàng (COD)',
        'Chuyển khoản ngân hàng',
        'Ví điện tử (MoMo, ZaloPay)',
        'Thẻ tín dụng/ghi nợ'
      ]
    },
    {
      number: 7,
      title: 'Xác nhận đơn hàng',
      description: 'Kiểm tra lại thông tin đơn hàng và xác nhận',
      icon: HiOutlineCheckCircle,
      details: [
        'Xem lại danh sách sản phẩm, số lượng, giá',
        'Kiểm tra địa chỉ giao hàng',
        'Xem tổng tiền và phí vận chuyển',
        'Click "Đặt hàng" để hoàn tất'
      ]
    },
    {
      number: 8,
      title: 'Nhận hàng',
      description: 'Theo dõi đơn hàng và nhận sản phẩm tại địa chỉ đã đăng ký',
      icon: HiOutlineTruck,
      details: [
        'Nhận email xác nhận đơn hàng',
        'Theo dõi trạng thái đơn hàng trong tài khoản',
        'Nhận hàng và kiểm tra sản phẩm',
        'Thanh toán nếu chọn COD'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/ho-tro"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-purple-600 font-semibold mb-4 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            <span>Quay lại hỗ trợ</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Hướng dẫn mua hàng
          </h1>
          <p className="text-gray-600 text-lg">
            Các bước đơn giản để mua sắm tại cửa hàng của chúng tôi
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 mb-4 text-lg">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-pink-300 to-purple-300 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Mẹo mua sắm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h3 className="font-bold mb-2">✓ Kiểm tra size trước khi mua</h3>
              <p className="text-white/90 text-sm">
                Xem bảng size guide và đánh giá của khách hàng để chọn size phù hợp
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h3 className="font-bold mb-2">✓ Theo dõi khuyến mãi</h3>
              <p className="text-white/90 text-sm">
                Đăng ký nhận thông báo để không bỏ lỡ các chương trình khuyến mãi hấp dẫn
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h3 className="font-bold mb-2">✓ Đọc đánh giá sản phẩm</h3>
              <p className="text-white/90 text-sm">
                Xem đánh giá và hình ảnh từ khách hàng đã mua để có quyết định tốt hơn
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h3 className="font-bold mb-2">✓ Lưu địa chỉ thường dùng</h3>
              <p className="text-white/90 text-sm">
                Lưu địa chỉ giao hàng để đặt hàng nhanh hơn trong các lần sau
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HuongDanMuaHang;

