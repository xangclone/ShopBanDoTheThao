import api from './api';

export const tinNhanService = {
  getTinNhanCuaToi: async () => {
    const response = await api.get('/tinnhan/cua-toi');
    return response.data;
  },

  guiTinNhan: async (data) => {
    const response = await api.post('/tinnhan/gui', data);
    return response.data;
  },

  // Admin
  getDanhSachKhachHang: async () => {
    const response = await api.get('/tinnhan/danh-sach-khach-hang');
    return response.data;
  },

  getTinNhanCuaKhachHang: async (khachHangId) => {
    const response = await api.get(`/tinnhan/khach-hang/${khachHangId}`);
    return response.data;
  },

  phanHoiKhachHang: async (khachHangId, noiDung) => {
    const response = await api.post(`/tinnhan/phan-hoi/${khachHangId}`, { noiDung });
    return response.data;
  },

  danhDauDaDoc: async (tinNhanId) => {
    const response = await api.put(`/tinnhan/${tinNhanId}/da-doc`);
    return response.data;
  },
};

