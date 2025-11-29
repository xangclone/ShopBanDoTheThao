import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCreditCard, HiOutlineCash, HiOutlinePhone, HiOutlineShieldCheck } from 'react-icons/hi';

function HuongDanThanhToan() {
  const paymentMethods = [
    {
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: HiOutlineCash,
      description: 'Thanh toán bằng tiền mặt khi nhận được hàng',
      steps: [
        'Chọn phương thức "Thanh toán khi nhận hàng"',
        'Hoàn tất đặt hàng',
        'Nhận hàng và thanh toán cho nhân viên giao hàng',
        'Kiểm tra sản phẩm trước khi thanh toán'
      ],
      color: 'from-green-500 to-emerald-500',
      note: 'Áp dụng cho tất cả đơn hàng. Phí thu hộ: 0đ'
    },
    {
      name: 'Chuyển khoản ngân hàng',
      icon: HiOutlineCreditCard,
      description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng',
      steps: [
        'Chọn phương thức "Chuyển khoản ngân hàng"',
        'Hoàn tất đặt hàng và nhận thông tin tài khoản',
        'Chuyển khoản đúng số tiền vào tài khoản được cung cấp',
        'Gửi ảnh chụp màn hình xác nhận chuyển khoản (nếu có)',
        'Đơn hàng sẽ được xử lý sau khi xác nhận nhận tiền'
      ],
      color: 'from-blue-500 to-cyan-500',
      note: 'Thông tin tài khoản sẽ được gửi qua email sau khi đặt hàng'
    },
    {
      name: 'Ví điện tử',
      icon: HiOutlinePhone,
      description: 'Thanh toán qua MoMo, ZaloPay, ShopeePay',
      steps: [
        'Chọn phương thức "Ví điện tử"',
        'Chọn loại ví muốn sử dụng (MoMo, ZaloPay, ShopeePay)',
        'Quét mã QR hoặc nhập thông tin thanh toán',
        'Xác nhận thanh toán trên ứng dụng ví',
        'Đơn hàng sẽ được xử lý ngay sau khi thanh toán thành công'
      ],
      color: 'from-purple-500 to-pink-500',
      note: 'Thanh toán nhanh chóng và an toàn'
    },
    {
      name: 'Thẻ tín dụng/Ghi nợ',
      icon: HiOutlineCreditCard,
      description: 'Thanh toán bằng thẻ Visa, Mastercard, JCB',
      steps: [
        'Chọn phương thức "Thẻ tín dụng/Ghi nợ"',
        'Nhập thông tin thẻ (số thẻ, họ tên, ngày hết hạn, CVV)',
        'Xác nhận thanh toán',
        'Đơn hàng sẽ được xử lý ngay sau khi thanh toán thành công'
      ],
      color: 'from-orange-500 to-red-500',
      note: 'Hỗ trợ thẻ quốc tế và thẻ nội địa'
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center">
              <HiOutlineCreditCard className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Hướng dẫn thanh toán
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Các phương thức thanh toán được hỗ trợ và cách sử dụng
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          {paymentMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{method.name}</h2>
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    {method.note && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                        <p className="text-sm text-gray-700"><strong>Lưu ý:</strong> {method.note}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Các bước thanh toán:</h3>
                  <div className="space-y-3">
                    {method.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {stepIndex + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <HiOutlineShieldCheck className="w-12 h-12 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Bảo mật thanh toán</h2>
              <p className="text-white/90 mb-4">
                Chúng tôi cam kết bảo mật thông tin thanh toán của bạn:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Mã hóa SSL 256-bit cho mọi giao dịch</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Không lưu trữ thông tin thẻ tín dụng trên hệ thống</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Tuân thủ tiêu chuẩn bảo mật PCI DSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Hợp tác với các đơn vị thanh toán uy tín</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp về thanh toán</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Thanh toán có an toàn không?',
                a: 'Có, chúng tôi sử dụng công nghệ mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật quốc tế để đảm bảo thông tin thanh toán của bạn được bảo vệ.'
              },
              {
                q: 'Có thể đổi phương thức thanh toán sau khi đặt hàng không?',
                a: 'Bạn có thể liên hệ với chúng tôi trong vòng 1 giờ sau khi đặt hàng để đổi phương thức thanh toán, nếu đơn hàng chưa được xử lý.'
              },
              {
                q: 'Thời gian xử lý thanh toán là bao lâu?',
                a: 'Đối với chuyển khoản: 1-2 giờ làm việc. Đối với ví điện tử và thẻ: Ngay lập tức. Đối với COD: Thanh toán khi nhận hàng.'
              },
              {
                q: 'Nếu thanh toán thất bại phải làm sao?',
                a: 'Nếu thanh toán thất bại, vui lòng kiểm tra lại thông tin thẻ/tài khoản hoặc liên hệ với chúng tôi để được hỗ trợ. Đơn hàng sẽ được giữ trong 24 giờ để bạn có thể thanh toán lại.'
              }
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-bold text-gray-800 mb-1">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HuongDanThanhToan;

