import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import minigameService from '../services/minigameService';
import { 
  HiOutlineSparkles, 
  HiOutlineGift, 
  HiOutlineStar,
  HiOutlineFire,
  HiOutlineX
} from 'react-icons/hi';

function Minigame() {
  const [minigames, setMinigames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    loadMinigames();
  }, []);

  const loadMinigames = async () => {
    try {
      setLoading(true);
      const data = await minigameService.getMinigames();
      // Chỉ hiển thị minigame đang hoạt động
      const activeGames = data.filter(game => game.dangHoatDong === true);
      setMinigames(activeGames);
    } catch (error) {
      toast.error('Không thể tải danh sách minigame');
    } finally {
      setLoading(false);
    }
  };

  const createConfetti = () => {
    if (!confettiRef.current) return;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confettiRef.current.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  };

  const handleChoiGame = async (game) => {
    if (spinning || !game.coTheChoi) return;

    setSelectedGame(game);
    setIsSpinning(true);
    setSpinning(true);
    setResult(null);

    try {
      // Animation quay vòng
      const spinDuration = 3000; // 3 giây
      const spins = 5 + Math.random() * 5; // 5-10 vòng
      const totalRotation = 360 * spins;
      
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setWheelRotation(totalRotation * easeOut);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);

      // Gọi API sau một chút để tạo hiệu ứng suspense
      await new Promise(resolve => setTimeout(resolve, spinDuration - 500));
      
      const ketQua = await minigameService.choiMinigame(game.id);
      
      // Hoàn thành animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResult(ketQua.ketQua);
      
      // Tạo confetti nếu có phần thưởng
      if (ketQua.ketQua?.soDiemNhanDuoc > 0 || ketQua.ketQua?.voucherDoiDiem) {
        createConfetti();
      }
      
      toast.success(ketQua.message || 'Chơi game thành công!');
      if (ketQua.ketQua?.soDiemNhanDuoc) {
        toast.info(`🎉 Bạn nhận được ${ketQua.ketQua.soDiemNhanDuoc} điểm!`);
      }
      loadMinigames();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể chơi game');
      setIsSpinning(false);
    } finally {
      setTimeout(() => {
        setSpinning(false);
        setIsSpinning(false);
      }, 500);
    }
  };

  const closeResultModal = () => {
    setResult(null);
    setSelectedGame(null);
    setWheelRotation(0);
  };

  // Các phần thưởng có thể có (cho hiển thị vòng quay)
  const rewards = [
    { label: '10 điểm', color: '#ff6b6b', icon: '⭐' },
    { label: '20 điểm', color: '#4ecdc4', icon: '🎁' },
    { label: '50 điểm', color: '#45b7d1', icon: '💎' },
    { label: '100 điểm', color: '#f9ca24', icon: '🏆' },
    { label: 'Voucher', color: '#f0932b', icon: '🎫' },
    { label: '200 điểm', color: '#eb4d4b', icon: '🔥' },
    { label: '500 điểm', color: '#6c5ce7', icon: '💫' },
    { label: '1000 điểm', color: '#a29bfe', icon: '👑' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="flex items-center justify-center gap-3 text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineSparkles className="w-12 h-12 text-pink-600 animate-pulse" />
            <span>Trò Chơi May Mắn</span>
            <HiOutlineSparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
          </h1>
          <p className="text-gray-600 text-lg">Chơi game và nhận phần thưởng hấp dẫn!</p>
        </div>

        {minigames.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-100/50 p-12 text-center">
            <HiOutlineSparkles className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Hiện tại không có minigame nào đang hoạt động</p>
            <p className="text-gray-400 text-sm">Vui lòng quay lại sau!</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Có <span className="font-bold text-pink-600">{minigames.length}</span> minigame đang hoạt động
              </p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {minigames.map((game) => (
              <div
                key={game.id}
                className={`group bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  game.coTheChoi
                    ? 'border-pink-200/50 hover:border-pink-400/50 cursor-pointer'
                    : 'border-gray-200/50 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl animate-bounce">🎰</div>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                    Đang hoạt động
                  </div>
                  {game.coTheChoi && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                      Có thể chơi
                    </div>
                  )}
                  {!game.coTheChoi && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Hết lượt
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{game.ten}</h3>
                  {game.moTa && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.moTa}</p>
                  )}

                  <div className="space-y-2 mb-6">
                    {game.soDiemCanThi > 0 && (
                      <div className="flex items-center justify-between text-sm bg-purple-50 rounded-lg p-2">
                        <span className="text-gray-600 flex items-center gap-1">
                          <HiOutlineStar className="w-4 h-4 text-purple-600" />
                          Điểm cần:
                        </span>
                        <span className="font-bold text-purple-600">
                          {game.soDiemCanThi} điểm
                        </span>
                      </div>
                    )}
                    {game.soLanChoiToiDa > 0 && (
                      <div className="flex items-center justify-between text-sm bg-blue-50 rounded-lg p-2">
                        <span className="text-gray-600">Lượt chơi:</span>
                        <span className="font-bold text-blue-600">
                          {game.soLanDaChoi} / {game.soLanChoiToiDa}
                        </span>
                      </div>
                    )}
                    {game.soLanChoiToiDa === 0 && (
                      <div className="flex items-center justify-between text-sm bg-green-50 rounded-lg p-2">
                        <span className="text-gray-600">Lượt chơi:</span>
                        <span className="font-bold text-green-600">Không giới hạn</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleChoiGame(game)}
                    disabled={!game.coTheChoi || spinning}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                      game.coTheChoi && !spinning
                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {spinning && selectedGame?.id === game.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Đang quay...
                      </span>
                    ) : game.coTheChoi ? (
                      <span className="flex items-center justify-center gap-2">
                        <HiOutlineFire className="w-5 h-5" />
                        Quay ngay
                      </span>
                    ) : (
                      'Không thể chơi'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Modal vòng quay */}
        {selectedGame && (isSpinning || result) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-pink-100/50 p-8 max-w-2xl w-full relative">
              <button
                onClick={closeResultModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedGame.ten}
                </h2>

                {/* Vòng quay */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative w-80 h-80">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                      <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-500 drop-shadow-lg"></div>
                    </div>

                    {/* Wheel */}
                    <div
                      ref={wheelRef}
                      className="relative w-full h-full rounded-full overflow-hidden border-8 border-yellow-400 shadow-2xl"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: isSpinning ? 'none' : 'transform 0.1s ease-out'
                      }}
                    >
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                        {rewards.map((reward, index) => {
                          const sliceAngle = 360 / rewards.length;
                          const startAngle = (sliceAngle * index - 90) * (Math.PI / 180);
                          const endAngle = (sliceAngle * (index + 1) - 90) * (Math.PI / 180);
                          const centerX = 200;
                          const centerY = 200;
                          const radius = 200;
                          
                          const x1 = centerX + radius * Math.cos(startAngle);
                          const y1 = centerY + radius * Math.sin(startAngle);
                          const x2 = centerX + radius * Math.cos(endAngle);
                          const y2 = centerY + radius * Math.sin(endAngle);
                          
                          const largeArc = sliceAngle > 180 ? 1 : 0;
                          
                          const pathData = [
                            `M ${centerX} ${centerY}`,
                            `L ${x1} ${y1}`,
                            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                            'Z'
                          ].join(' ');
                          
                          const textAngle = (startAngle + endAngle) / 2;
                          const textRadius = radius * 0.7;
                          const textX = centerX + textRadius * Math.cos(textAngle);
                          const textY = centerY + textRadius * Math.sin(textAngle);
                          
                          return (
                            <g key={index}>
                              <path
                                d={pathData}
                                fill={reward.color}
                                stroke="#fff"
                                strokeWidth="2"
                              />
                              <text
                                x={textX}
                                y={textY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontSize="16"
                                fontWeight="bold"
                                transform={`rotate(${(textAngle * 180) / Math.PI + 90}, ${textX}, ${textY})`}
                              >
                                {reward.icon} {reward.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Kết quả */}
                {result && !isSpinning && (
                  <div className="animate-fade-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 animate-bounce">
                      {result.loaiPhanThuong === 'Diem' ? (
                        <HiOutlineStar className="w-12 h-12 text-white" />
                      ) : result.loaiPhanThuong === 'Voucher' ? (
                        <HiOutlineGift className="w-12 h-12 text-white" />
                      ) : (
                        <HiOutlineSparkles className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {result.moTa || 'Chúc mừng!'}
                    </h3>
                    {result.soDiemNhanDuoc > 0 && (
                      <div className="mb-6">
                        <p className="text-5xl font-bold text-green-600 mb-2 animate-pulse">
                          +{result.soDiemNhanDuoc} điểm
                        </p>
                        <p className="text-gray-600">Đã được cộng vào tài khoản của bạn!</p>
                      </div>
                    )}
                    {result.voucherDoiDiem && (
                      <div className="mb-6">
                        <p className="text-2xl font-bold text-purple-600 mb-2">
                          🎁 Voucher: {result.voucherDoiDiem.ten}
                        </p>
                        <p className="text-gray-600">Voucher đã được thêm vào tài khoản!</p>
                      </div>
                    )}
                    <button
                      onClick={closeResultModal}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Tuyệt vời!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confetti container */}
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          top: -10px;
          animation: confetti-fall linear forwards;
        }
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Minigame;
