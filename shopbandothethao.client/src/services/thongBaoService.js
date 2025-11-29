import api from './api';

const thongBaoService = {
  // Lấy danh sách thông báo
  getThongBao: async (chuaDoc = null) => {
    const params = chuaDoc !== null ? { chuaDoc } : {};
    const response = await api.get('/thongbao', { params });
    return response.data;
  },

  // Đếm số thông báo chưa đọc
  getSoLuongChuaDoc: async () => {
    const response = await api.get('/thongbao/chua-doc/count');
    return response.data;
  },

  // Đánh dấu đã đọc
  danhDauDaDoc: async (id) => {
    const response = await api.put(`/thongbao/${id}/danh-dau-da-doc`);
    return response.data;
  },

  // Đánh dấu tất cả đã đọc
  danhDauTatCaDaDoc: async () => {
    const response = await api.put('/thongbao/danh-dau-tat-ca-da-doc');
    return response.data;
  },

  // Xóa thông báo
  xoaThongBao: async (id) => {
    const response = await api.delete(`/thongbao/${id}`);
    return response.data;
  },
};

export default thongBaoService;


