import api from './api';

export const xacNhanChuyenKhoanService = {
  taoXacNhanChuyenKhoan: async (formData) => {
    const response = await api.post('/xacnhanchuyenkhoan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getXacNhanChuyenKhoanByDonHang: async (donHangId) => {
    const response = await api.get(`/xacnhanchuyenkhoan/don-hang/${donHangId}`);
    return response.data;
  },
};
