import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineQuestionMarkCircle, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineArrowLeft } from 'react-icons/hi';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      title: 'Đặt hàng & Thanh toán',
      questions: [
        {
          q: 'Làm thế nào để đặt hàng?',
          a: 'Bạn có thể đặt hàng theo các bước sau:\n1. Tìm kiếm sản phẩm bạn muốn mua\n2. Chọn size và màu sắc (nếu có)\n3. Thêm vào giỏ hàng\n4. Kiểm tra giỏ hàng và nhập thông tin giao hàng\n5. Chọn phương thức thanh toán\n6. Xác nhận đơn hàng'
        },
        {
          q: 'Có những phương thức thanh toán nào?',
          a: 'Chúng tôi hỗ trợ các phương thức thanh toán:\n- Thanh toán khi nhận hàng (COD)\n- Chuyển khoản ngân hàng\n- Ví điện tử (MoMo, ZaloPay)\n- Thẻ tín dụng/ghi nợ'
        },
        {
          q: 'Làm sao để biết đơn hàng đã được xác nhận?',
          a: 'Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận đơn hàng. Bạn cũng có thể kiểm tra trạng thái đơn hàng trong mục "Đơn hàng" của tài khoản.'
        },
        {
          q: 'Có thể hủy đơn hàng sau khi đặt không?',
          a: 'Bạn có thể hủy đơn hàng trong vòng 1 giờ sau khi đặt hàng hoặc trước khi đơn hàng được xác nhận và chuẩn bị giao hàng.'
        }
      ]
    },
    {
      title: 'Vận chuyển & Giao hàng',
      questions: [
        {
          q: 'Thời gian giao hàng là bao lâu?',
          a: 'Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào:\n- Khu vực giao hàng (nội thành: 2-3 ngày, ngoại thành: 3-5 ngày)\n- Phương thức vận chuyển bạn chọn\n- Thời điểm đặt hàng (đơn hàng đặt sau 17h sẽ được xử lý vào ngày hôm sau)'
        },
        {
          q: 'Phí vận chuyển là bao nhiêu?',
          a: 'Phí vận chuyển được tính dựa trên:\n- Khoảng cách và địa chỉ giao hàng\n- Trọng lượng và kích thước sản phẩm\n- Phương thức vận chuyển\nMiễn phí ship cho đơn hàng từ 500.000đ trở lên.'
        },
        {
          q: 'Có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?',
          a: 'Bạn có thể thay đổi địa chỉ giao hàng trong vòng 1 giờ sau khi đặt hàng hoặc liên hệ với chúng tôi qua hotline/email nếu đơn hàng chưa được chuẩn bị giao hàng.'
        },
        {
          q: 'Làm sao để theo dõi đơn hàng?',
          a: 'Bạn có thể theo dõi đơn hàng bằng cách:\n- Đăng nhập vào tài khoản và vào mục "Đơn hàng"\n- Nhập mã đơn hàng vào ô tìm kiếm\n- Kiểm tra email cập nhật trạng thái đơn hàng'
        }
      ]
    },
    {
      title: 'Đổi trả & Hoàn tiền',
      questions: [
        {
          q: 'Chính sách đổi trả như thế nào?',
          a: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với các điều kiện:\n- Sản phẩm còn nguyên vẹn, chưa sử dụng\n- Còn đầy đủ tem mác, bao bì\n- Có hóa đơn mua hàng\n- Không thuộc danh mục sản phẩm không được đổi trả'
        },
        {
          q: 'Làm thế nào để yêu cầu đổi trả?',
          a: 'Bạn có thể yêu cầu đổi trả bằng cách:\n1. Đăng nhập vào tài khoản\n2. Vào mục "Đơn hàng" và chọn đơn hàng cần đổi trả\n3. Chọn "Yêu cầu đổi trả" và điền lý do\n4. Chờ xác nhận từ chúng tôi'
        },
        {
          q: 'Thời gian xử lý đổi trả là bao lâu?',
          a: 'Sau khi nhận được sản phẩm đổi trả, chúng tôi sẽ kiểm tra và xử lý trong vòng 3-5 ngày làm việc. Sau đó, sản phẩm mới sẽ được giao đến bạn hoặc tiền sẽ được hoàn lại.'
        },
        {
          q: 'Phí đổi trả có mất phí không?',
          a: 'Nếu lỗi do chúng tôi (sản phẩm lỗi, sai mẫu, thiếu hàng), chúng tôi sẽ chịu toàn bộ chi phí. Nếu đổi trả do lý do khác, bạn sẽ chịu phí vận chuyển đổi trả.'
        }
      ]
    },
    {
      title: 'Tài khoản & Bảo mật',
      questions: [
        {
          q: 'Làm thế nào để đăng ký tài khoản?',
          a: 'Bạn có thể đăng ký tài khoản bằng cách:\n1. Click vào "Đăng ký" ở góc trên bên phải\n2. Điền thông tin đầy đủ (họ tên, email, số điện thoại, mật khẩu)\n3. Xác nhận email (nếu có)\n4. Hoàn tất đăng ký'
        },
        {
          q: 'Quên mật khẩu phải làm sao?',
          a: 'Bạn có thể khôi phục mật khẩu bằng cách:\n1. Click "Quên mật khẩu" ở trang đăng nhập\n2. Nhập email đã đăng ký\n3. Kiểm tra email và làm theo hướng dẫn\n4. Đặt mật khẩu mới'
        },
        {
          q: 'Thông tin cá nhân có được bảo mật không?',
          a: 'Chúng tôi cam kết bảo mật thông tin cá nhân của khách hàng theo quy định của pháp luật. Thông tin chỉ được sử dụng cho mục đích phục vụ khách hàng và không được chia sẻ cho bên thứ ba.'
        },
        {
          q: 'Có thể đăng nhập bằng Google/Facebook không?',
          a: 'Có, chúng tôi hỗ trợ đăng nhập bằng tài khoản Google và Facebook để thuận tiện hơn cho bạn.'
        }
      ]
    },
    {
      title: 'Sản phẩm & Chất lượng',
      questions: [
        {
          q: 'Sản phẩm có đảm bảo chính hãng không?',
          a: 'Tất cả sản phẩm của chúng tôi đều là hàng chính hãng, có đầy đủ tem mác và giấy tờ chứng minh nguồn gốc xuất xứ.'
        },
        {
          q: 'Làm sao để chọn đúng size?',
          a: 'Bạn có thể:\n- Xem bảng size guide trên trang sản phẩm\n- Đo kích thước cơ thể và so sánh với bảng size\n- Liên hệ với chúng tôi để được tư vấn\n- Xem đánh giá của khách hàng đã mua'
        },
        {
          q: 'Sản phẩm có được bảo hành không?',
          a: 'Tùy thuộc vào từng sản phẩm, chúng tôi có chính sách bảo hành riêng. Bạn có thể xem thông tin bảo hành trên trang chi tiết sản phẩm hoặc liên hệ với chúng tôi.'
        },
        {
          q: 'Có thể xem sản phẩm trước khi mua không?',
          a: 'Hiện tại chúng tôi chỉ bán hàng online. Tuy nhiên, bạn có thể xem hình ảnh chi tiết, video và đánh giá của khách hàng trên trang sản phẩm.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <HiOutlineQuestionMarkCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Câu hỏi thường gặp
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Tìm câu trả lời cho các câu hỏi phổ biến của bạn
          </p>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-pink-200">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={questionIndex}
                      className="border-2 border-pink-100 rounded-xl overflow-hidden hover:border-pink-300 transition-colors"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between p-4 md:p-6 text-left bg-white/50 hover:bg-pink-50 transition-colors"
                      >
                        <span className="font-bold text-gray-800 pr-4">{item.q}</span>
                        {isOpen ? (
                          <HiOutlineChevronUp className="w-6 h-6 text-pink-600 flex-shrink-0" />
                        ) : (
                          <HiOutlineChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 md:p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-t-2 border-pink-100">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Vẫn chưa tìm thấy câu trả lời?</h2>
          <p className="mb-6 text-white/90">
            Liên hệ với chúng tôi để được hỗ trợ trực tiếp
          </p>
          <Link
            to="/ho-tro/lien-he"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span>Liên hệ ngay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQ;

