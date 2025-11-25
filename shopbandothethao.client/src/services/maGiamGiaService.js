import api from './api';

export const maGiamGiaService = {
  getDangHoatDong: async (limit = 1) => {
    const response = await api.get('/magiamgia/dang-hoat-dong', { params: { limit } });
    return response.data;
  },

  kiemTra: async (ma, tongTienSanPham) => {
    const response = await api.post('/magiamgia/kiemtra', {
      ma,
      tongTienSanPham
    });
    return response.data;
  },
};


