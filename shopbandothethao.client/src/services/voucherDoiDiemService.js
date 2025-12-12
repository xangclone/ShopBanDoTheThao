import api from './api';

const voucherDoiDiemService = {
  // Lấy danh sách voucher có thể đổi
  getVouchers: async () => {
    const response = await api.get('/voucherdoidiem');
    return response.data;
  },

  // Lấy chi tiết voucher
  getVoucherById: async (id) => {
    const response = await api.get(`/voucherdoidiem/${id}`);
    return response.data;
  }
};

export default voucherDoiDiemService;








