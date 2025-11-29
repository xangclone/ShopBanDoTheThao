import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineRefresh, HiOutlineClock, HiOutlineShieldCheck, HiOutlineX } from 'react-icons/hi';

function ChinhSachDoiTra() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <HiOutlineRefresh className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chính sách đổi trả
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Quy định về đổi trả và hoàn tiền sản phẩm
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Điều kiện đổi trả */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <HiOutlineShieldCheck className="w-7 h-7 text-pink-600" />
              Điều kiện đổi trả
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">✓ Sản phẩm được đổi trả khi:</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Sản phẩm bị lỗi do nhà sản xuất (rách, lỗi kỹ thuật, thiếu phụ kiện)</li>
                  <li>• Sản phẩm không đúng với mô tả trên website</li>
                  <li>• Giao nhầm sản phẩm, sai size, sai màu</li>
                  <li>• Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>• Còn đầy đủ tem mác, nhãn hiệu, bao bì gốc</li>
                  <li>• Có hóa đơn mua hàng hoặc email xác nhận đơn hàng</li>
                  <li>• Trong vòng 7 ngày kể từ ngày nhận hàng</li>
                </ul>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <HiOutlineX className="w-5 h-5 text-red-600" />
                  Sản phẩm không được đổi trả khi:
                </h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Đã qua sử dụng, có dấu hiệu mặc thử</li>
                  <li>• Bị hư hỏng do lỗi của khách hàng</li>
                  <li>• Thiếu phụ kiện, tem mác do khách hàng làm mất</li>
                  <li>• Quá thời hạn 7 ngày kể từ ngày nhận hàng</li>
                  <li>• Sản phẩm thuộc danh mục không được đổi trả (đồ lót, phụ kiện cá nhân)</li>
                  <li>• Không có hóa đơn hoặc chứng từ mua hàng</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quy trình đổi trả */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineRefresh className="w-7 h-7 text-purple-600" />
              Quy trình đổi trả
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: 'Bước 1',
                  title: 'Yêu cầu đổi trả',
                  content: 'Đăng nhập vào tài khoản, vào mục "Đơn hàng", chọn đơn hàng cần đổi trả và click "Yêu cầu đổi trả". Điền lý do và mô tả chi tiết.'
                },
                {
                  step: 'Bước 2',
                  title: 'Xác nhận yêu cầu',
                  content: 'Chúng tôi sẽ xem xét yêu cầu và phản hồi trong vòng 24-48 giờ. Nếu được chấp nhận, bạn sẽ nhận được hướng dẫn gửi hàng về.'
                },
                {
                  step: 'Bước 3',
                  title: 'Gửi hàng về',
                  content: 'Đóng gói sản phẩm cẩn thận (giữ nguyên bao bì gốc nếu có), gửi về địa chỉ chúng tôi cung cấp. Lưu ý: Nếu lỗi do chúng tôi, chúng tôi sẽ chịu phí vận chuyển.'
                },
                {
                  step: 'Bước 4',
                  title: 'Kiểm tra và xử lý',
                  content: 'Sau khi nhận hàng, chúng tôi sẽ kiểm tra trong vòng 3-5 ngày làm việc. Nếu đạt điều kiện, chúng tôi sẽ tiến hành đổi sản phẩm mới hoặc hoàn tiền.'
                },
                {
                  step: 'Bước 5',
                  title: 'Hoàn tất',
                  content: 'Sản phẩm mới sẽ được giao đến bạn hoặc tiền sẽ được hoàn lại vào tài khoản/phương thức thanh toán ban đầu trong vòng 5-7 ngày làm việc.'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-r-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2">{item.step}: {item.title}</h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thời gian xử lý */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <HiOutlineClock className="w-7 h-7 text-indigo-600" />
              Thời gian xử lý
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">Xác nhận yêu cầu</h3>
                <p className="text-gray-700">24-48 giờ sau khi nhận yêu cầu</p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">Kiểm tra sản phẩm</h3>
                <p className="text-gray-700">3-5 ngày làm việc sau khi nhận hàng</p>
              </div>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">Hoàn tiền</h3>
                <p className="text-gray-700">5-7 ngày làm việc sau khi xác nhận</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-2">Giao hàng đổi</h3>
                <p className="text-gray-700">2-5 ngày làm việc sau khi xác nhận</p>
              </div>
            </div>
          </div>

          {/* Phí đổi trả */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Phí đổi trả</h2>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Miễn phí:</strong> Nếu lỗi do chúng tôi (sản phẩm lỗi, sai mẫu, thiếu hàng), chúng tôi sẽ chịu toàn bộ chi phí vận chuyển đổi trả.
                </p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Khách hàng chịu phí:</strong> Nếu đổi trả do lý do khác (không vừa, không thích, v.v.), khách hàng sẽ chịu phí vận chuyển đổi trả (khoảng 30.000 - 50.000đ tùy khu vực).
                </p>
              </div>
            </div>
          </div>

          {/* Lưu ý */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Lưu ý quan trọng</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-2xl">•</span>
                <span>Vui lòng kiểm tra sản phẩm ngay khi nhận hàng để phát hiện lỗi kịp thời</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">•</span>
                <span>Giữ nguyên bao bì, tem mác khi chưa quyết định giữ sản phẩm</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">•</span>
                <span>Chụp ảnh sản phẩm khi phát hiện lỗi để làm bằng chứng</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">•</span>
                <span>Liên hệ ngay với chúng tôi nếu có bất kỳ thắc mắc nào</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChinhSachDoiTra;

