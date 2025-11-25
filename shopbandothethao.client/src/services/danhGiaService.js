import api from './api';

export const danhGiaService = {
  taoDanhGia: async (data) => {
    const response = await api.post('/danhgia', data);
    return response.data;
  },

  getDanhGiaBySanPham: async (sanPhamId) => {
    const response = await api.get(`/danhgia/sanpham/${sanPhamId}`);
    return response.data;
  },
};



