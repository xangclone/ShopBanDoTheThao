// Service để lấy dữ liệu địa lý từ API miễn phí
const API_BASE_URL = 'https://provinces.open-api.vn/api';

export const diaLyService = {
  // Lấy danh sách tất cả tỉnh/thành phố
  getTinhThanhPho: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/p/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Tỉnh/thành phố loaded:', data.length);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Lỗi khi tải tỉnh/thành phố:', error);
      return [];
    }
  },

  // Lấy danh sách quận/huyện theo mã tỉnh/thành phố
  getQuanHuyen: async (tinhCode) => {
    try {
      if (!tinhCode) return [];
      const response = await fetch(`${API_BASE_URL}/p/${tinhCode}?depth=2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Quận/huyện loaded:', data.districts?.length || 0);
      return Array.isArray(data.districts) ? data.districts : [];
    } catch (error) {
      console.error('Lỗi khi tải quận/huyện:', error);
      return [];
    }
  },

  // Lấy danh sách phường/xã theo mã quận/huyện
  getPhuongXa: async (quanHuyenCode) => {
    try {
      if (!quanHuyenCode) return [];
      const response = await fetch(`${API_BASE_URL}/d/${quanHuyenCode}?depth=2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Phường/xã loaded:', data.wards?.length || 0);
      return Array.isArray(data.wards) ? data.wards : [];
    } catch (error) {
      console.error('Lỗi khi tải phường/xã:', error);
      return [];
    }
  },

  // Tìm tỉnh/thành phố theo tên
  findTinhByName: async (tenTinh) => {
    try {
      const tinhList = await diaLyService.getTinhThanhPho();
      return tinhList.find(t => t.name === tenTinh || t.name_with_type === tenTinh);
    } catch (error) {
      console.error('Lỗi khi tìm tỉnh:', error);
      return null;
    }
  },
};


