import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import popupService from '../services/popupService';
import { getImageUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';

function PopupDisplay() {
  const [popups, setPopups] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPopups();
  }, []);

  const loadPopups = async () => {
    try {
      const data = await popupService.getPopup();
      if (data && data.length > 0) {
        // Lọc popup đã xem (nếu hienThiMotLan = true) và chỉ lấy popup có hình ảnh
        const filteredPopups = data.filter((popup) => {
          if (!popup.hinhAnh) return false; // Chỉ hiển thị popup có hình ảnh
          // Kiểm tra popup đã được đánh dấu "không hiển thị lại"
          const dontShowKey = `popup_dont_show_${popup.id}`;
          if (localStorage.getItem(dontShowKey)) return false;
          // Kiểm tra popup đã xem (nếu hienThiMotLan = true)
          if (popup.hienThiMotLan) {
            const viewedKey = `popup_viewed_${popup.id}`;
            return !localStorage.getItem(viewedKey);
          }
          return true;
        });

        if (filteredPopups.length > 0) {
          setPopups(filteredPopups);
          // Hiển thị popup đầu tiên sau 1 giây
          setTimeout(() => {
            setShow(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải popup:', error);
    }
  };

  const handleClose = () => {
    const currentPopup = popups[currentPopupIndex];
    if (currentPopup) {
      // Nếu checkbox "Không hiển thị lại" được chọn
      if (dontShowAgain) {
        localStorage.setItem(`popup_dont_show_${currentPopup.id}`, 'true');
      } else if (currentPopup.hienThiMotLan) {
        // Đánh dấu đã xem (nếu hienThiMotLan = true)
        localStorage.setItem(`popup_viewed_${currentPopup.id}`, Date.now().toString());
      }
    }

    // Reset checkbox
    setDontShowAgain(false);

    // Nếu còn popup khác, hiển thị popup tiếp theo
    if (currentPopupIndex < popups.length - 1) {
      setCurrentPopupIndex(currentPopupIndex + 1);
    } else {
      setShow(false);
      setCurrentPopupIndex(0);
    }
  };

  const handleImageClick = () => {
    const currentPopup = popups[currentPopupIndex];
    if (currentPopup && currentPopup.lienKet) {
      if (currentPopup.lienKet.startsWith('http')) {
        window.open(currentPopup.lienKet, '_blank');
      } else {
        navigate(currentPopup.lienKet);
      }
      handleClose();
    }
  };

  if (!show || popups.length === 0) {
    return null;
  }

  const currentPopup = popups[currentPopupIndex];

  if (!currentPopup.hinhAnh) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="relative max-w-4xl w-full flex flex-col items-center gap-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 p-3 rounded-full bg-white/90 hover:bg-white transition-colors z-10 shadow-lg"
        >
          <HiX className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image - Clickable if has link */}
        <div 
          className={`relative rounded-2xl overflow-hidden shadow-2xl w-full ${currentPopup.lienKet ? 'cursor-pointer' : ''}`}
          onClick={currentPopup.lienKet ? handleImageClick : undefined}
        >
          <ImageWithFallback
            src={currentPopup.hinhAnh}
            alt={currentPopup.tieuDe || 'Popup'}
            className={`w-full h-auto object-contain max-h-[75vh] ${currentPopup.lienKet ? 'hover:opacity-90 transition-opacity' : ''}`}
          />
        </div>

        {/* Checkbox "Không hiển thị lại" - Nằm dưới ngoài hình */}
        <div className="flex items-center justify-center">
          <label className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Không hiển thị lại</span>
          </label>
        </div>

        {/* Popup counter */}
        {popups.length > 1 && (
          <div className="flex gap-2">
            {popups.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPopupIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupDisplay;

