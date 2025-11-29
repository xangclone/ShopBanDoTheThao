import { useState, useEffect } from 'react';
import { flashSaleService } from '../../services/flashSaleService';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineX, HiOutlineSearch, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

function QuanLyFlashSale() {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSanPhamModal, setShowSanPhamModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentFlashSaleId, setCurrentFlashSaleId] = useState(null);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSanPhamId, setEditingSanPhamId] = useState(null);
  const [editFormData, setEditFormData] = useState({ giaFlashSale: '', soLuongToiDa: '', uuTien: '', dangHoatDong: true });
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    hinhAnh: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    dangHoatDong: true,
    uuTien: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await flashSaleService.getDanhSachFlashSale();
      setFlashSales(data);
    } catch (error) {
      toast.error('Không thể tải danh sách flash sale');
    } finally {
      setLoading(false);
    }
  };

  const loadSanPham = async () => {
    try {
      const response = await adminService.getDanhSachSanPham('', '', '', 1, 1000);
      setSanPhamList(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    }
  };

  const handleOpenModal = async (id = null) => {
    if (id) {
      try {
        const data = await flashSaleService.getFlashSaleByIdAdmin(id);
        setFormData({
          ten: data.ten || '',
          moTa: data.moTa || '',
          hinhAnh: data.hinhAnh || '',
          thoiGianBatDau: data.thoiGianBatDau ? new Date(data.thoiGianBatDau).toISOString().slice(0, 16) : '',
          thoiGianKetThuc: data.thoiGianKetThuc ? new Date(data.thoiGianKetThuc).toISOString().slice(0, 16) : '',
          dangHoatDong: data.dangHoatDong,
          uuTien: data.uuTien || 0,
        });
        setSelectedSanPham(data.danhSachSanPham || []);
        setEditingId(id);
      } catch (error) {
        toast.error('Không thể tải thông tin flash sale');
        return;
      }
    } else {
      setFormData({
        ten: '',
        moTa: '',
        hinhAnh: '',
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
        dangHoatDong: true,
        uuTien: 0,
      });
      setSelectedSanPham([]);
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        thoiGianBatDau: new Date(formData.thoiGianBatDau).toISOString(),
        thoiGianKetThuc: new Date(formData.thoiGianKetThuc).toISOString(),
        uuTien: parseInt(formData.uuTien),
        danhSachSanPham: editingId ? undefined : selectedSanPham.map(sp => ({
          sanPhamId: sp.sanPhamId || sp.id,
          giaFlashSale: sp.giaFlashSale || sp.giaFlashSale,
          soLuongToiDa: sp.soLuongToiDa || 0,
          uuTien: sp.uuTien || 0,
          dangHoatDong: sp.dangHoatDong !== false,
        })),
      };

      if (editingId) {
        await flashSaleService.capNhatFlashSale(editingId, dataToSend);
        toast.success('Cập nhật flash sale thành công!');
      } else {
        await flashSaleService.taoFlashSale(dataToSend);
        toast.success('Tạo flash sale thành công!');
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa flash sale này?')) {
      return;
    }
    try {
      await flashSaleService.xoaFlashSale(id);
      toast.success('Xóa flash sale thành công!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa flash sale');
    }
  };

  const handleOpenSanPhamModal = async (id) => {
    setCurrentFlashSaleId(id);
    await loadSanPham();
    try {
      const data = await flashSaleService.getFlashSaleByIdAdmin(id);
      setSelectedSanPham(data.danhSachSanPham || []);
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm');
    }
    setShowSanPhamModal(true);
  };

  const handleAddSanPham = async (sanPhamId, giaFlashSale, soLuongToiDa = 0) => {
    try {
      await flashSaleService.themSanPhamVaoFlashSale(currentFlashSaleId, {
        sanPhamId,
        giaFlashSale: parseFloat(giaFlashSale),
        soLuongToiDa: parseInt(soLuongToiDa),
        uuTien: 0,
        dangHoatDong: true,
      });
      toast.success('Thêm sản phẩm thành công!');
      const data = await flashSaleService.getFlashSaleByIdAdmin(currentFlashSaleId);
      setSelectedSanPham(data.danhSachSanPham || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể thêm sản phẩm');
    }
  };

  const handleRemoveSanPham = async (sanPhamId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi flash sale?')) {
      return;
    }
    try {
      await flashSaleService.xoaSanPhamKhoiFlashSale(currentFlashSaleId, sanPhamId);
      toast.success('Xóa sản phẩm thành công!');
      const data = await flashSaleService.getFlashSaleByIdAdmin(currentFlashSaleId);
      setSelectedSanPham(data.danhSachSanPham || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleEditSanPham = (sp) => {
    setEditingSanPhamId(sp.id);
    setEditFormData({
      giaFlashSale: sp.giaFlashSale.toString(),
      soLuongToiDa: sp.soLuongToiDa.toString(),
      uuTien: sp.uuTien.toString(),
      dangHoatDong: sp.dangHoatDong,
    });
  };

  const handleSaveEditSanPham = async (sanPhamId) => {
    try {
      if (!editFormData.giaFlashSale || parseFloat(editFormData.giaFlashSale) <= 0) {
        toast.error('Vui lòng nhập giá flash sale hợp lệ');
        return;
      }
      await flashSaleService.capNhatSanPhamTrongFlashSale(currentFlashSaleId, sanPhamId, {
        giaFlashSale: parseFloat(editFormData.giaFlashSale),
        soLuongToiDa: parseInt(editFormData.soLuongToiDa) || 0,
        uuTien: parseInt(editFormData.uuTien) || 0,
        dangHoatDong: editFormData.dangHoatDong,
      });
      toast.success('Cập nhật sản phẩm thành công!');
      setEditingSanPhamId(null);
      const data = await flashSaleService.getFlashSaleByIdAdmin(currentFlashSaleId);
      setSelectedSanPham(data.danhSachSanPham || []);
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
    }
  };

  const handleCancelEdit = () => {
    setEditingSanPhamId(null);
    setEditFormData({ giaFlashSale: '', soLuongToiDa: '', uuTien: '', dangHoatDong: true });
  };

  const filteredSanPhamList = sanPhamList.filter(sp => 
    !selectedSanPham.some(selected => selected.sanPhamId === sp.id) &&
    (sp.ten?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     sp.id?.toString().includes(searchTerm))
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('vi-VN');
  };

  const getTrangThai = (flashSale) => {
    if (!flashSale.dangHoatDong) return { text: 'Đã tắt', color: 'text-gray-500' };
    
    const now = new Date();
    const batDau = new Date(flashSale.thoiGianBatDau);
    const ketThuc = new Date(flashSale.thoiGianKetThuc);
    
    if (now < batDau) return { text: 'Sắp diễn ra', color: 'text-blue-500' };
    if (now >= batDau && now <= ketThuc) return { text: 'Đang diễn ra', color: 'text-green-500' };
    return { text: 'Đã kết thúc', color: 'text-red-500' };
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Flash Sale</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
        >
          <HiOutlinePlus className="w-5 h-5" />
          <span>Tạo Flash Sale</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-red-50 to-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số lượng SP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ưu tiên</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flashSales.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Chưa có flash sale nào
                </td>
              </tr>
            ) : (
              flashSales.map((fs) => {
                const trangThai = getTrangThai(fs);
                return (
                  <tr key={fs.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fs.ten}</div>
                      {fs.moTa && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{fs.moTa}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Bắt đầu: {formatDateTime(fs.thoiGianBatDau)}</div>
                        <div>Kết thúc: {formatDateTime(fs.thoiGianKetThuc)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fs.soLuongSanPham} sản phẩm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${trangThai.color}`}>
                        {trangThai.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fs.uuTien}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenSanPhamModal(fs.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Quản lý sản phẩm"
                        >
                          <HiOutlineClock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(fs.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(fs.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal tạo/sửa Flash Sale */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Chỉnh sửa Flash Sale' : 'Tạo Flash Sale mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Flash Sale *</label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ví dụ: Flash Sale Black Friday"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mô tả về flash sale..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.thoiGianBatDau}
                    onChange={(e) => setFormData({ ...formData, thoiGianBatDau: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.thoiGianKetThuc}
                    onChange={(e) => setFormData({ ...formData, thoiGianKetThuc: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
                  <input
                    type="number"
                    value={formData.uuTien}
                    onChange={(e) => setFormData({ ...formData, uuTien: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dangHoatDong}
                      onChange={(e) => setFormData({ ...formData, dangHoatDong: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Đang hoạt động</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal quản lý sản phẩm */}
      {showSanPhamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm Flash Sale</h2>
              <button
                onClick={() => {
                  setShowSanPhamModal(false);
                  setSearchTerm('');
                  setEditingSanPhamId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Sản phẩm đã thêm */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                  Sản phẩm đã thêm ({selectedSanPham.length})
                </h3>
                {selectedSanPham.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    Chưa có sản phẩm nào trong flash sale này
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedSanPham.map((sp) => (
                      editingSanPhamId === sp.id ? (
                        <div key={sp.id} className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-2">{sp.tenSanPham}</div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Giá Flash Sale (VNĐ) *
                                    <span className="text-gray-500 ml-1">(Tối đa: {formatPrice(sp.giaGoc - 1000)})</span>
                                  </label>
                                  <input
                                    type="number"
                                    step="1000"
                                    min="0"
                                    max={sp.giaGoc - 1}
                                    value={editFormData.giaFlashSale}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) < sp.giaGoc)) {
                                        setEditFormData({ ...editFormData, giaFlashSale: value });
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                  />
                                  {editFormData.giaFlashSale && parseFloat(editFormData.giaFlashSale) >= sp.giaGoc && (
                                    <p className="text-xs text-red-600 mt-1">Giá flash sale phải nhỏ hơn giá gốc ({formatPrice(sp.giaGoc)})</p>
                                  )}
                                  {editFormData.giaFlashSale && parseFloat(editFormData.giaFlashSale) > 0 && parseFloat(editFormData.giaFlashSale) < sp.giaGoc && (
                                    <p className="text-xs text-green-600 mt-1">
                                      Giảm: {Math.round(((sp.giaGoc - parseFloat(editFormData.giaFlashSale)) / sp.giaGoc) * 100)}%
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng tối đa (0 = không giới hạn)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editFormData.soLuongToiDa}
                                    onChange={(e) => setEditFormData({ ...editFormData, soLuongToiDa: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Ưu tiên</label>
                                  <input
                                    type="number"
                                    value={editFormData.uuTien}
                                    onChange={(e) => setEditFormData({ ...editFormData, uuTien: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                                <div className="flex items-center pt-6">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={editFormData.dangHoatDong}
                                      onChange={(e) => setEditFormData({ ...editFormData, dangHoatDong: e.target.checked })}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Đang hoạt động</span>
                                  </label>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEditSanPham(sp.sanPhamId)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={sp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {sp.hinhAnhChinh ? (
                                <img 
                                  src={sp.hinhAnhChinh} 
                                  alt={sp.tenSanPham}
                                  className="w-20 h-20 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="font-semibold text-gray-900 truncate">{sp.tenSanPham}</div>
                                {sp.dangHoatDong ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded whitespace-nowrap">Đang hoạt động</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded whitespace-nowrap">Đã tắt</span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Giá gốc:</span>
                                  <span className="ml-1 line-through text-gray-400">{formatPrice(sp.giaGoc)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Giá Flash Sale:</span>
                                  <span className="ml-1 font-semibold text-red-600">{formatPrice(sp.giaFlashSale)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Giảm:</span>
                                  <span className="ml-1 font-semibold text-red-600">{sp.phanTramGiam}%</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Đã bán:</span>
                                  <span className="ml-1">{sp.soLuongDaBan || 0}</span>
                                  {sp.soLuongToiDa > 0 && (
                                    <span className="text-gray-400"> / {sp.soLuongToiDa}</span>
                                  )}
                                </div>
                                {sp.soLuongTon !== undefined && (
                                  <div className="col-span-2 md:col-span-4">
                                    <span className="text-gray-500">Tồn kho:</span>
                                    <span className={`ml-1 font-medium ${sp.soLuongTon > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {sp.soLuongTon}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleEditSanPham(sp)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="Chỉnh sửa"
                              >
                                <HiOutlinePencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRemoveSanPham(sp.sanPhamId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Xóa"
                              >
                                <HiOutlineTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Thêm sản phẩm mới */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiOutlinePlus className="w-5 h-5 text-blue-500" />
                  Thêm sản phẩm mới
                </h3>
                <div className="mb-4">
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm theo tên hoặc ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {filteredSanPhamList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Không tìm thấy sản phẩm' : 'Đã thêm tất cả sản phẩm'}
                    </div>
                  ) : (
                    filteredSanPhamList.map((sp) => (
                      <SanPhamAddItem
                        key={sp.id}
                        sanPham={sp}
                        onAdd={handleAddSanPham}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SanPhamAddItem({ sanPham, onAdd }) {
  const [giaFlashSale, setGiaFlashSale] = useState('');
  const [soLuongToiDa, setSoLuongToiDa] = useState('0');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!giaFlashSale || parseFloat(giaFlashSale) <= 0) {
      alert('Vui lòng nhập giá flash sale hợp lệ');
      return;
    }
    if (parseFloat(giaFlashSale) >= sanPham.gia) {
      alert('Giá flash sale phải nhỏ hơn giá gốc');
      return;
    }
    onAdd(sanPham.id, giaFlashSale, soLuongToiDa);
    setGiaFlashSale('');
    setSoLuongToiDa('0');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const phanTramGiam = sanPham.gia > 0 && giaFlashSale 
    ? Math.round(((sanPham.gia - parseFloat(giaFlashSale)) / sanPham.gia) * 100)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {sanPham.hinhAnhChinh ? (
          <img 
            src={sanPham.hinhAnhChinh} 
            alt={sanPham.ten}
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{sanPham.ten}</div>
        <div className="text-sm text-gray-500">
          <span>Giá gốc: {formatPrice(sanPham.gia)}</span>
          {sanPham.soLuongTon !== undefined && (
            <span className="ml-3">Tồn kho: {sanPham.soLuongTon}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            step="1000"
            min="0"
            max={sanPham.gia - 1}
            value={giaFlashSale}
            onChange={(e) => setGiaFlashSale(e.target.value)}
            placeholder="Giá flash sale"
            className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            min="0"
            value={soLuongToiDa}
            onChange={(e) => setSoLuongToiDa(e.target.value)}
            placeholder="SL tối đa (0=không giới hạn)"
            className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        {giaFlashSale && phanTramGiam > 0 && (
          <div className="text-center">
            <div className="text-red-600 font-bold text-lg">-{phanTramGiam}%</div>
            <div className="text-xs text-gray-500">Giảm</div>
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all text-sm font-medium shadow-sm"
        >
          Thêm
        </button>
      </div>
    </form>
  );
}

export default QuanLyFlashSale;

