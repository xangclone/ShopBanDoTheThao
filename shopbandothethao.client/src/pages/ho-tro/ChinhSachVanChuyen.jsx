import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTruck, HiOutlineClock, HiOutlineMap, HiOutlineGift } from 'react-icons/hi';

function ChinhSachVanChuyen() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <HiOutlineTruck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chính sách vận chuyển
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Thông tin về phí vận chuyển và thời gian giao hàng
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Phí vận chuyển */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineTruck className="w-7 h-7 text-green-600" />
              Phí vận chuyển
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineGift className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Miễn phí vận chuyển</h3>
                </div>
                <p className="text-gray-700 mb-2">
                  Áp dụng cho đơn hàng từ <strong className="text-green-600">500.000đ</strong> trở lên
                </p>
                <p className="text-sm text-gray-600">
                  Áp dụng cho tất cả các khu vực trong nước
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineMap className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Phí vận chuyển</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Nội thành:</strong> 30.000đ</p>
                  <p><strong>Ngoại thành:</strong> 50.000đ</p>
                  <p><strong>Vùng sâu, vùng xa:</strong> 80.000đ - 150.000đ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thời gian giao hàng */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineClock className="w-7 h-7 text-blue-600" />
              Thời gian giao hàng
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Nội thành (TP.HCM, Hà Nội)</h3>
                <p className="text-gray-700">2-3 ngày làm việc</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Tỉnh/thành phố khác</h3>
                <p className="text-gray-700">3-5 ngày làm việc</p>
              </div>
              <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Vùng sâu, vùng xa</h3>
                <p className="text-gray-700">5-7 ngày làm việc</p>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-gray-700">
                <strong>Lưu ý:</strong> Thời gian giao hàng được tính từ khi đơn hàng được xác nhận và chuẩn bị giao hàng. 
                Đơn hàng đặt sau 17h sẽ được xử lý vào ngày hôm sau.
              </p>
            </div>
          </div>

          {/* Phương thức vận chuyển */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Phương thức vận chuyển</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Giao hàng tiêu chuẩn',
                  description: 'Giao hàng qua các đơn vị vận chuyển uy tín (Viettel Post, Giao Hàng Nhanh, J&T Express)',
                  time: '2-5 ngày',
                  fee: '30.000đ - 50.000đ'
                },
                {
                  name: 'Giao hàng nhanh',
                  description: 'Giao hàng trong ngày hoặc ngày hôm sau (chỉ áp dụng cho nội thành)',
                  time: 'Trong ngày',
                  fee: '50.000đ - 100.000đ'
                },
                {
                  name: 'Giao hàng siêu tốc',
                  description: 'Giao hàng trong 2-4 giờ (chỉ áp dụng cho một số khu vực)',
                  time: '2-4 giờ',
                  fee: '100.000đ - 200.000đ'
                },
                {
                  name: 'Nhận tại cửa hàng',
                  description: 'Đến trực tiếp cửa hàng để nhận hàng (miễn phí)',
                  time: 'Sau 1 ngày',
                  fee: 'Miễn phí'
                }
              ].map((method, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-5 hover:shadow-lg transition-all">
                  <h3 className="font-bold text-gray-800 mb-2">{method.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700"><strong>Thời gian:</strong> {method.time}</span>
                    <span className="text-pink-600 font-semibold"><strong>Phí:</strong> {method.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quy trình giao hàng */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quy trình giao hàng</h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Xác nhận đơn hàng',
                  content: 'Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận đơn hàng trong vòng 1-2 giờ.'
                },
                {
                  step: '2',
                  title: 'Chuẩn bị hàng',
                  content: 'Chúng tôi sẽ chuẩn bị và đóng gói sản phẩm cẩn thận, đảm bảo chất lượng.'
                },
                {
                  step: '3',
                  title: 'Giao cho đơn vị vận chuyển',
                  content: 'Sản phẩm được giao cho đơn vị vận chuyển và bạn sẽ nhận được mã vận đơn để theo dõi.'
                },
                {
                  step: '4',
                  title: 'Đang vận chuyển',
                  content: 'Bạn có thể theo dõi trạng thái đơn hàng qua mã vận đơn hoặc trong tài khoản của mình.'
                },
                {
                  step: '5',
                  title: 'Giao hàng thành công',
                  content: 'Nhân viên giao hàng sẽ liên hệ trước khi giao. Vui lòng kiểm tra sản phẩm trước khi nhận.'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-r-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lưu ý */}
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Lưu ý khi nhận hàng</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Kiểm tra kỹ sản phẩm trước khi ký nhận</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Nếu sản phẩm bị hư hỏng, sai mẫu, vui lòng từ chối nhận và liên hệ ngay với chúng tôi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Giữ lại hóa đơn và mã vận đơn để đối chiếu khi cần</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span>Nếu không có người nhận, đơn hàng sẽ được giao lại vào lần sau (tối đa 3 lần)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChinhSachVanChuyen;

