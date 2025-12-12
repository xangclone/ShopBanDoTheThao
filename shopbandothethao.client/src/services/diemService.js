import api from './api';

const diemService = {
  // Lấy thông tin điểm
  getThongTinDiem: async () => {
    const response = await api.get('/diem/thong-tin');
    return response.data;
  },

  // Lấy lịch sử điểm
  getLichSuDiem: async (page = 1, pageSize = 20) => {
    const response = await api.get(`/diem/lich-su?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Đổi voucher
  doiVoucher: async (voucherId) => {
    const response = await api.post(`/diem/doi-voucher/${voucherId}`);
    return response.data;
  }
};

export default diemService;








