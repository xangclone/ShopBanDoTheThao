import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taiKhoanNganHangService } from '../services/taiKhoanNganHangService';
import { xacNhanChuyenKhoanService } from '../services/xacNhanChuyenKhoanService';
import { HiOutlineX, HiOutlineCamera, HiOutlineQrcode, HiOutlineDocumentText } from 'react-icons/hi';
import { QRCodeSVG } from 'qrcode.react';

function ChuyenKhoanModal({ isOpen, onClose, donHangId, tongTien }) {
  const [taiKhoanNganHang, setTaiKhoanNganHang] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    soTaiKhoanGui: '',
    tenNguoiGui: '',
    noiDungChuyenKhoan: '',
    hinhAnhChungTu: null,
    ghiChu: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTaiKhoanNganHang();
    }
  }, [isOpen]);

  const loadTaiKhoanNganHang = async () => {
    try {
      const data = await taiKhoanNganHangService.getTaiKhoanNganHangDangHoatDong();
      setTaiKhoanNganHang(data || []);
      if (data && data.length > 0) {
        setSelectedAccount(data[0]);
        // Tạo nội dung chuyển khoản mặc định
        setFormData(prev => ({
          ...prev,
          noiDungChuyenKhoan: `Thanh toan don hang ${donHangId}`
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải tài khoản ngân hàng:', error);
      toast.error('Không thể tải thông tin tài khoản ngân hàng');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setFormData({ ...formData, hinhAnhChungTu: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAccount) {
      toast.error('Vui lòng chọn tài khoản ngân hàng');
      return;
    }

    if (!formData.soTaiKhoanGui || !formData.tenNguoiGui) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('donHangId', donHangId);
      submitData.append('taiKhoanNganHangId', selectedAccount.id);
      submitData.append('soTaiKhoanGui', formData.soTaiKhoanGui);
      submitData.append('tenNguoiGui', formData.tenNguoiGui);
      submitData.append('soTien', tongTien);
      submitData.append('noiDungChuyenKhoan', formData.noiDungChuyenKhoan || '');
      if (formData.hinhAnhChungTu) {
        submitData.append('hinhAnhChungTu', formData.hinhAnhChungTu);
      }
      if (formData.ghiChu) {
        submitData.append('ghiChu', formData.ghiChu);
      }

      await xacNhanChuyenKhoanService.taoXacNhanChuyenKhoan(submitData);
      toast.success('Đã gửi xác nhận chuyển khoản thành công! Chúng tôi sẽ xử lý trong thời gian sớm nhất.');
      onClose();
    } catch (error) {
      console.error('Lỗi khi gửi xác nhận:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi xác nhận chuyển khoản');
    } finally {
      setLoading(false);
    }
  };

  // Tạo nội dung QR code
  const getQRContent = () => {
    if (!selectedAccount) return '';
    // Format theo chuẩn VietQR hoặc BankPlus
    return `2|99|${selectedAccount.soTaiKhoan}|${selectedAccount.tenChuTaiKhoan}|${selectedAccount.tenNganHang}|${formData.noiDungChuyenKhoan || ''}|0|0|${tongTien}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Xác nhận chuyển khoản</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn tài khoản ngân hàng */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Chọn tài khoản ngân hàng <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {taiKhoanNganHang.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccount(account)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAccount?.id === account.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="font-bold text-gray-800">{account.tenNganHang}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>STK: <span className="font-semibold">{account.soTaiKhoan}</span></div>
                      <div>Chủ TK: <span className="font-semibold">{account.tenChuTaiKhoan}</span></div>
                      {account.chiNhanh && (
                        <div className="text-xs text-gray-500 mt-1">{account.chiNhanh}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedAccount && (
              <>
                {/* QR Code */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                  <div className="flex items-center gap-3 mb-4">
                    <HiOutlineQrcode className="w-6 h-6 text-pink-600" />
                    <h3 className="font-bold text-gray-800">Quét QR để chuyển khoản</h3>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <QRCodeSVG
                        value={getQRContent()}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-sm">
                      <div className="bg-white/80 p-3 rounded-lg">
                        <div className="font-semibold text-gray-700">Ngân hàng:</div>
                        <div className="text-gray-800">{selectedAccount.tenNganHang}</div>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg">
                        <div className="font-semibold text-gray-700">Số tài khoản:</div>
                        <div className="text-gray-800 font-mono">{selectedAccount.soTaiKhoan}</div>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg">
                        <div className="font-semibold text-gray-700">Chủ tài khoản:</div>
                        <div className="text-gray-800">{selectedAccount.tenChuTaiKhoan}</div>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg">
                        <div className="font-semibold text-gray-700">Số tiền:</div>
                        <div className="text-pink-600 font-bold text-lg">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(tongTien)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin chuyển khoản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Số tài khoản người gửi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.soTaiKhoanGui}
                      onChange={(e) => setFormData({ ...formData, soTaiKhoanGui: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                      placeholder="Nhập số tài khoản của bạn"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tên người gửi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tenNguoiGui}
                      onChange={(e) => setFormData({ ...formData, tenNguoiGui: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nội dung chuyển khoản
                  </label>
                  <input
                    type="text"
                    value={formData.noiDungChuyenKhoan}
                    onChange={(e) => setFormData({ ...formData, noiDungChuyenKhoan: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="Nội dung chuyển khoản"
                  />
                </div>

                {/* Upload ảnh chứng từ */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <HiOutlineCamera className="w-5 h-5 inline mr-2" />
                    Ảnh chứng từ chuyển khoản
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="chungTuUpload"
                    />
                    <label
                      htmlFor="chungTuUpload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-w-full max-h-64 rounded-lg mb-2"
                        />
                      ) : (
                        <>
                          <HiOutlineDocumentText className="w-12 h-12 text-gray-400 mb-2" />
                          <span className="text-gray-600">Click để chọn ảnh chứng từ</span>
                          <span className="text-xs text-gray-400 mt-1">(Tối đa 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Ghi chú (nếu có)
                  </label>
                  <textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 resize-none"
                    placeholder="Ghi chú thêm (nếu có)"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi xác nhận'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChuyenKhoanModal;

