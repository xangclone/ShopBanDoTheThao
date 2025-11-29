import api from './api';

export const taiKhoanNganHangService = {
  getTaiKhoanNganHangDangHoatDong: async () => {
    const response = await api.get('/taikhoannganhang/dang-hoat-dong');
    return response.data;
  },
};
