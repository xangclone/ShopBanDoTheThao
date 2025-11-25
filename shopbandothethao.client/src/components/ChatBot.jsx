import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { tinNhanService } from '../services/tinNhanService';
import { authService } from '../services/authService';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Lắng nghe event mở chatbot từ trang sản phẩm
    const handleOpenChatbot = (event) => {
      setIsOpen(true);
      if (event.detail?.product) {
        const product = event.detail.product;
        const question = event.detail.question || 'Tôi muốn tư vấn về sản phẩm này';
        
        setCurrentProduct(product);
        
        // Tự động gửi tin nhắn về sản phẩm từ người dùng
        const userProductMessage = {
          id: Date.now(),
          type: 'user',
          text: question,
          product: product
        };
        
        setMessages(prev => [...prev, userProductMessage]);
        
        // Lưu tin nhắn vào database nếu đã đăng nhập
        if (authService.isAuthenticated()) {
          tinNhanService.guiTinNhan({
            noiDung: question,
            loai: 'User',
            sanPhamId: product.id
          }).catch(error => {
            console.error('Lỗi khi lưu tin nhắn:', error);
          });
        }
        
        // Thông báo chờ phản hồi
        const notificationMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: `Cảm ơn bạn đã quan tâm đến sản phẩm "${product.ten}"! Tư vấn viên sẽ phản hồi trong thời gian sớm nhất.`,
        };
        setMessages(prev => [...prev, notificationMessage]);
      }
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);

  // Load tin nhắn từ server
  const loadTinNhansFromServer = async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const tinNhans = await tinNhanService.getTinNhanCuaToi();
      if (tinNhans && tinNhans.length > 0) {
        const serverMessages = tinNhans.map(tn => ({
          id: tn.id,
          type: tn.loai === 'User' ? 'user' : tn.loai === 'Human' ? 'human' : 'bot',
          text: tn.noiDung,
          product: tn.sanPham ? {
            id: tn.sanPham.id,
            ten: tn.sanPham.ten,
            hinhAnhChinh: tn.sanPham.hinhAnhChinh,
            gia: tn.sanPham.gia,
            slug: tn.sanPham.slug
          } : null,
          ngayGui: tn.ngayGui
        }));
        
        // Merge với tin nhắn hiện tại, tránh duplicate
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = serverMessages.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMessages].sort((a, b) => {
            const dateA = a.ngayGui ? new Date(a.ngayGui) : new Date(a.id);
            const dateB = b.ngayGui ? new Date(b.ngayGui) : new Date(b.id);
            return dateA - dateB;
          });
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải tin nhắn:', error);
    }
  };

  useEffect(() => {
    // Load tin nhắn từ server khi mở chat và đã đăng nhập
    if (isOpen && authService.isAuthenticated()) {
      loadTinNhansFromServer();
      
      // Auto refresh mỗi 3 giây để nhận tin nhắn mới từ admin
      const interval = setInterval(() => {
        loadTinNhansFromServer();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (text = null) => {
    const userMessage = text || inputMessage.trim();
    if (!userMessage && !text) return;

    // Thêm tin nhắn người dùng vào UI
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      product: currentProduct
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Lưu tin nhắn vào database nếu đã đăng nhập
    if (authService.isAuthenticated()) {
      try {
        const savedMessage = await tinNhanService.guiTinNhan({
          noiDung: userMessage,
          loai: 'User',
          sanPhamId: currentProduct?.id || null
        });
        // Cập nhật ID từ server
        newUserMessage.id = savedMessage.id;
        newUserMessage.ngayGui = savedMessage.ngayGui;
      } catch (error) {
        console.error('Lỗi khi lưu tin nhắn:', error);
      }
    }

    // Gửi đến tư vấn viên
    setIsTyping(false);
    // Thêm tin nhắn thông báo ngắn gọn
    const notificationMessage = {
      id: Date.now(),
      type: 'bot',
      text: 'Tin nhắn của bạn đã được gửi đến tư vấn viên. Vui lòng chờ phản hồi...',
    };
    setMessages(prev => [...prev, notificationMessage]);
    // Tin nhắn từ admin sẽ được load tự động qua loadTinNhansFromServer

    // Reset current product sau khi gửi
    setCurrentProduct(null);
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <>
      {/* Chat Button - Modern Design */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 z-50 flex items-center justify-center group hover:scale-110 active:scale-95"
          aria-label="Mở chat"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
            1
          </span>
        </button>
      )}

      {/* Chat Window - Modern Design */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[680px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-0 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header - Modern Gradient */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tư vấn viên</h3>
                  <p className="text-xs text-white/90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Đang hoạt động
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentProduct(null);
                }}
                className="text-white/90 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                aria-label="Đóng chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages - Modern Design */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-gray-700 font-semibold mb-2">Chào mừng bạn đến với hỗ trợ</h4>
                <p className="text-sm text-gray-500">Gửi tin nhắn để bắt đầu trò chuyện với tư vấn viên</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type !== 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[75%] ${message.type === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md' 
                  : message.type === 'human' 
                  ? 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm' 
                  : 'bg-white/80 text-gray-700 rounded-2xl rounded-bl-md shadow-sm'} px-4 py-3 shadow-lg`}>
                  {/* Hiển thị sản phẩm nếu có */}
                  {message.product && (
                    <div className={`mb-3 p-3 rounded-xl ${message.type === 'user' ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
                      <div className="flex space-x-3">
                        <ImageWithFallback
                          src={message.product.hinhAnhChinh}
                          alt={message.product.ten}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm mb-1 ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                            {message.product.ten}
                          </h4>
                          <p className={`text-sm font-bold ${message.type === 'user' ? 'text-white' : 'text-indigo-600'}`}>
                            {formatPrice(message.product.gia)}
                            {message.product.giaGoc && message.product.giaGoc > message.product.gia && (
                              <span className="ml-2 text-xs font-normal line-through opacity-75">
                                {formatPrice(message.product.giaGoc)}
                              </span>
                            )}
                          </p>
                          <Link
                            to={`/san-pham/${message.product.id}`}
                            onClick={() => setIsOpen(false)}
                            className={`text-xs mt-2 inline-flex items-center gap-1 font-medium ${message.type === 'user' ? 'text-white/90 hover:text-white' : 'text-indigo-600 hover:text-indigo-700'}`}
                          >
                            Xem chi tiết
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                  {message.ngayGui && (
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(message.ngayGui).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator - Modern */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-gray-200">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}


            <div ref={messagesEndRef} />
          </div>

          {/* Input - Modern Design */}
          <div className="border-t border-gray-200/50 p-5 bg-white/95 backdrop-blur-sm">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm placeholder:text-gray-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="absolute right-2 bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nhấn Enter để gửi tin nhắn
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;

