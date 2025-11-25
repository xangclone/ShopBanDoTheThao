import api from './api';

export const gioHangService = {
  getGioHang: async () => {
    const response = await api.get('/giohang');
    return response.data;
  },

  themVaoGioHang: async (data) => {
    try {
      // Đảm bảo dữ liệu được gửi đúng format
      const requestData = {
        sanPhamId: parseInt(data.sanPhamId),
        soLuong: parseInt(data.soLuong) || 1,
        kichThuoc: data.kichThuoc && data.kichThuoc.trim() !== '' ? data.kichThuoc.trim() : null,
        mauSac: data.mauSac && data.mauSac.trim() !== '' ? data.mauSac.trim() : null,
      };
      
      // Validate dữ liệu trước khi gửi
      if (!requestData.sanPhamId || isNaN(requestData.sanPhamId) || requestData.sanPhamId <= 0) {
        throw new Error('SanPhamId không hợp lệ');
      }
      
      if (!requestData.soLuong || requestData.soLuong < 1) {
        throw new Error('Số lượng phải lớn hơn 0');
      }
      
      console.log('Gửi dữ liệu đến API:', requestData);
      
      const response = await api.post('/giohang', requestData);
      return response.data;
    } catch (error) {
      // Log chi tiết lỗi
      if (error.response) {
        console.error('Lỗi từ server:', error.response.data);
        const errorMessage = error.response.data?.message || error.response.data?.errors || 'Lỗi không xác định';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      } else if (error.request) {
        console.error('Không nhận được phản hồi từ server:', error.request);
        throw new Error('Không thể kết nối đến server');
      } else {
        console.error('Lỗi:', error.message);
        throw error;
      }
    }
  },

  capNhatGioHang: async (id, data) => {
    const response = await api.put(`/giohang/${id}`, data);
    return response.data;
  },

  xoaKhoiGioHang: async (id) => {
    const response = await api.delete(`/giohang/${id}`);
    return response.data;
  },

  xoaTatCa: async () => {
    const response = await api.delete('/giohang/xoa-tat-ca');
    return response.data;
  },
};



