import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  HiOutlineArrowLeft, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineChat,
  HiOutlineUser,
  HiOutlinePaperAirplane
} from 'react-icons/hi';

function LienHe() {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    chuDe: '',
    noiDung: ''
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.hoTen || !formData.email || !formData.noiDung) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSending(true);
    
    // TODO: Gửi yêu cầu hỗ trợ đến backend
    setTimeout(() => {
      toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setFormData({
        hoTen: '',
        email: '',
        soDienThoai: '',
        chuDe: '',
        noiDung: ''
      });
      setSending(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: HiOutlinePhone,
      title: 'Hotline',
      content: '1900-xxxx',
      subContent: '24/7 hỗ trợ',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HiOutlineMail,
      title: 'Email',
      content: 'support@shopbandothethao.com',
      subContent: 'Phản hồi trong 24h',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: HiOutlineLocationMarker,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ',
      subContent: 'TP. Hồ Chí Minh',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: HiOutlineClock,
      title: 'Giờ làm việc',
      content: '8:00 - 22:00',
      subContent: 'Tất cả các ngày trong tuần',
      color: 'from-green-500 to-emerald-500'
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
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Gửi yêu cầu hỗ trợ hoặc phản hồi của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <HiOutlineChat className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Gửi yêu cầu hỗ trợ</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="0123456789"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Chủ đề
                  </label>
                  <select
                    name="chuDe"
                    value={formData.chuDe}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="dat-hang">Đặt hàng</option>
                    <option value="van-chuyen">Vận chuyển</option>
                    <option value="doi-tra">Đổi trả</option>
                    <option value="thanh-toan">Thanh toán</option>
                    <option value="san-pham">Sản phẩm</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="noiDung"
                    value={formData.noiDung}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors resize-none"
                    placeholder="Mô tả chi tiết yêu cầu hoặc vấn đề của bạn..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePaperAirplane className="w-5 h-5" />
                      <span>Gửi yêu cầu</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${info.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                      <p className="font-semibold mb-1">{info.content}</p>
                      <p className="text-white/80 text-sm">{info.subContent}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Placeholder */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Bản đồ</h3>
              <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                <p className="text-gray-500">Bản đồ sẽ được hiển thị tại đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LienHe;

