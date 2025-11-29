import api from './api';

export const yeuThichService = {
  getYeuThich: async () => {
    const response = await api.get('/yeuthich');
    return response.data;
  },

  themVaoYeuThich: async (sanPhamId) => {
    const response = await api.post('/yeuthich', { sanPhamId });
    return response.data;
  },

  xoaKhoiYeuThich: async (id) => {
    const response = await api.delete(`/yeuthich/${id}`);
    return response.data;
  },

  xoaKhoiYeuThichBySanPhamId: async (sanPhamId) => {
    const response = await api.delete(`/yeuthich/sanpham/${sanPhamId}`);
    return response.data;
  },

  kiemTraYeuThich: async (sanPhamId) => {
    const response = await api.get(`/yeuthich/kiemtra/${sanPhamId}`);
    return response.data;
  },
};



