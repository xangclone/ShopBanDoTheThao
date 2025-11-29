import { useState } from 'react';
import { toast } from 'react-toastify';
import { danhGiaService } from '../services/danhGiaService';

function DanhGiaModal({ isOpen, onClose, sanPham, onSuccess }) {
  const [soSao, setSoSao] = useState(0);
  const [noiDung, setNoiDung] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soSao === 0) {
      toast.error('Vui lòng chọn số sao');
      return;
    }

    setLoading(true);
    try {
      await danhGiaService.taoDanhGia({
        sanPhamId: sanPham.id,
        soSao,
        noiDung: noiDung.trim() || null,
      });
      toast.success('Đánh giá thành công!');
      onSuccess();
      onClose();
      setSoSao(0);
      setNoiDung('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể đánh giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
          
          {sanPham && (
            <div className="mb-4 flex items-center gap-3">
              <img
                src={sanPham.hinhAnhChinh || '/placeholder.jpg'}
                alt={sanPham.ten}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{sanPham.ten}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Số sao *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSoSao(star)}
                    className={`text-3xl transition-colors ${
                      star <= soSao ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {soSao > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {soSao === 5 && 'Rất hài lòng'}
                  {soSao === 4 && 'Hài lòng'}
                  {soSao === 3 && 'Bình thường'}
                  {soSao === 2 && 'Không hài lòng'}
                  {soSao === 1 && 'Rất không hài lòng'}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Nhận xét</label>
              <textarea
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">{noiDung.length}/1000</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DanhGiaModal;




