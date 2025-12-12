import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineStar, HiOutlineGift, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

function ChinhSachTichDiem() {
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
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <HiOutlineStar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chính sách tích điểm
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Quy định và hướng dẫn về hệ thống tích điểm và hạng VIP
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Cách tích điểm */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineStar className="w-7 h-7 text-yellow-600" />
              Cách tích điểm
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <HiOutlineCheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Mua hàng</h3>
                    <p className="text-gray-700 mb-2">
                      Tích điểm khi thanh toán thành công đơn hàng:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Tỷ lệ tích điểm: <strong className="text-yellow-600">1%</strong> giá trị đơn hàng (sau giảm giá, trước thuế)</li>
                      <li>Điểm được tích tự động sau khi thanh toán thành công</li>
                      <li>Tỷ lệ tích điểm có thể tăng theo hạng VIP của bạn</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-3">
                      <strong>Ví dụ:</strong> Đơn hàng 1.000.000đ → Nhận 10.000 điểm (hạng thường) hoặc 15.000 điểm (hạng Vàng với tỷ lệ 1.5x)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <HiOutlineSparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chơi Minigame</h3>
                    <p className="text-gray-700 mb-2">
                      Tham gia các minigame để nhận điểm thưởng:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Một số minigame miễn phí, một số cần điểm để chơi</li>
                      <li>Nhận điểm hoặc voucher ngẫu nhiên khi chơi</li>
                      <li>Có giới hạn số lần chơi mỗi ngày</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <HiOutlineGift className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hoạt động khác</h3>
                    <p className="text-gray-700 mb-2">
                      Nhận điểm từ các hoạt động:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Đánh giá sản phẩm sau khi mua</li>
                      <li>Chia sẻ sản phẩm lên mạng xã hội</li>
                      <li>Tham gia các chương trình khuyến mãi đặc biệt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hạng VIP */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineStar className="w-7 h-7 text-purple-600" />
              Hạng VIP và quyền lợi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Đồng',
                  icon: '🥉',
                  color: 'from-amber-500 to-orange-500',
                  borderColor: 'border-amber-300',
                  bgColor: 'from-amber-50 to-orange-50',
                  diem: '0 - 10.000',
                  tiLe: '1.0x',
                  giamGia: '0%',
                  description: 'Hạng cơ bản cho khách hàng mới'
                },
                {
                  name: 'Bạc',
                  icon: '🥈',
                  color: 'from-gray-400 to-gray-600',
                  borderColor: 'border-gray-300',
                  bgColor: 'from-gray-50 to-slate-50',
                  diem: '10.001 - 50.000',
                  tiLe: '1.2x',
                  giamGia: '2%',
                  description: 'Tích điểm nhanh hơn và giảm giá nhẹ'
                },
                {
                  name: 'Vàng',
                  icon: '🥇',
                  color: 'from-yellow-400 to-yellow-600',
                  borderColor: 'border-yellow-300',
                  bgColor: 'from-yellow-50 to-amber-50',
                  diem: '50.001 - 200.000',
                  tiLe: '1.5x',
                  giamGia: '5%',
                  description: 'Quyền lợi tốt hơn đáng kể'
                },
                {
                  name: 'Bạch Kim',
                  icon: '💎',
                  color: 'from-cyan-400 to-blue-500',
                  borderColor: 'border-cyan-300',
                  bgColor: 'from-cyan-50 to-blue-50',
                  diem: '200.001 - 500.000',
                  tiLe: '2.0x',
                  giamGia: '8%',
                  description: 'Hạng cao cấp với nhiều ưu đãi'
                },
                {
                  name: 'Kim Cương',
                  icon: '💠',
                  color: 'from-purple-500 to-pink-500',
                  borderColor: 'border-purple-300',
                  bgColor: 'from-purple-50 to-pink-50',
                  diem: '500.001+',
                  tiLe: '2.5x',
                  giamGia: '10%',
                  description: 'Hạng cao nhất với quyền lợi tối đa'
                }
              ].map((hang, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${hang.bgColor} border-2 ${hang.borderColor} rounded-xl p-6 hover:shadow-xl transition-all`}
                >
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${hang.color} rounded-full text-3xl mb-3`}>
                      {hang.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{hang.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm tích lũy:</span>
                      <span className="font-semibold text-gray-800">{hang.diem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ tích điểm:</span>
                      <span className="font-semibold text-purple-600">{hang.tiLe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-semibold text-green-600">{hang.giamGia}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      {hang.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-gray-700">
                <strong>Lưu ý:</strong> Hạng VIP được tự động cập nhật dựa trên tổng điểm tích lũy của bạn. 
                Khi đạt đủ điểm, hệ thống sẽ tự động nâng cấp hạng VIP của bạn.
              </p>
            </div>
          </div>

          {/* Cách sử dụng điểm */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineGift className="w-7 h-7 text-pink-600" />
              Cách sử dụng điểm
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Đổi Voucher</h3>
                <p className="text-gray-700 mb-3">
                  Sử dụng điểm để đổi các voucher giảm giá:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Vào trang <strong>"Đổi Voucher"</strong> để xem danh sách voucher có sẵn</li>
                  <li>Chọn voucher muốn đổi và xác nhận</li>
                  <li>Điểm sẽ được trừ từ <strong>Điểm khả dụng</strong> của bạn</li>
                  <li>Nhận mã giảm giá ngay sau khi đổi thành công</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Chơi Minigame</h3>
                <p className="text-gray-700 mb-3">
                  Một số minigame yêu cầu điểm để chơi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Chọn minigame muốn chơi</li>
                  <li>Trả điểm nếu minigame yêu cầu</li>
                  <li>Nhận điểm hoặc voucher ngẫu nhiên khi thắng</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quy định về điểm */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HiOutlineCheckCircle className="w-7 h-7 text-green-600" />
              Quy định về điểm
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Điểm tích lũy vs Điểm khả dụng</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li><strong>Điểm tích lũy:</strong> Tổng điểm bạn đã nhận được từ trước đến nay (không bao giờ giảm)</li>
                  <li><strong>Điểm khả dụng:</strong> Điểm bạn có thể sử dụng để đổi voucher hoặc chơi game (có thể giảm khi sử dụng)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Thời hạn điểm</h3>
                <p className="text-gray-700">
                  Điểm không có thời hạn sử dụng. Bạn có thể tích lũy và sử dụng bất cứ lúc nào.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Trường hợp không tích điểm</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Đơn hàng bị hủy hoặc hoàn trả</li>
                  <li>Đơn hàng chưa thanh toán thành công</li>
                  <li>Sử dụng điểm để thanh toán (không tích điểm cho phần thanh toán bằng điểm)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Hoàn điểm khi hủy/hoàn trả đơn hàng</h3>
                <p className="text-gray-700">
                  Nếu đơn hàng đã tích điểm bị hủy hoặc hoàn trả, điểm đã tích sẽ bị trừ lại. 
                  Điểm đã sử dụng để đổi voucher sẽ không được hoàn lại.
                </p>
              </div>
            </div>
          </div>

          {/* Lưu ý quan trọng */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-2 border-pink-200 rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <HiOutlineXCircle className="w-7 h-7 text-red-600" />
              Lưu ý quan trọng
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                • Điểm không thể chuyển nhượng hoặc quy đổi thành tiền mặt
              </p>
              <p>
                • Mỗi voucher đổi bằng điểm chỉ có thể sử dụng 1 lần
              </p>
              <p>
                • Chúng tôi có quyền điều chỉnh chính sách tích điểm mà không cần thông báo trước
              </p>
              <p>
                • Mọi gian lận trong việc tích điểm sẽ bị xử lý nghiêm và có thể dẫn đến khóa tài khoản
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu tích điểm ngay hôm nay!</h2>
            <p className="text-lg mb-6 opacity-90">
              Mua sắm và tích điểm để nhận nhiều ưu đãi hấp dẫn
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tich-diem"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Xem điểm của tôi
              </Link>
              <Link
                to="/doi-voucher"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                Đổi voucher
              </Link>
              <Link
                to="/minigame"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                Chơi minigame
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChinhSachTichDiem;








