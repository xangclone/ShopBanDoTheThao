import api from './api';

export const sanPhamService = {
  getDanhSach: async (params = {}) => {
    const response = await api.get('/sanpham', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sanpham/${id}`);
    return response.data;
  },

  getNoiBat: async (limit = 10) => {
    const response = await api.get('/sanpham/noibat', { params: { limit } });
    return response.data;
  },

  getKhuyenMai: async (limit = 10) => {
    const response = await api.get('/sanpham/khuyenmai', { params: { limit } });
    return response.data;
  },

  timKiem: async (query, limit = 5) => {
    const response = await api.get('/sanpham/tim-kiem', { params: { q: query, limit } });
    return response.data;
  },

  getTuongTu: async (id, limit = 8) => {
    const response = await api.get(`/sanpham/${id}/tuongtu`, { params: { limit } });
    return response.data;
  },

  getBanChay: async (limit = 10) => {
    const response = await api.get('/sanpham/banchay', { params: { limit } });
    return response.data;
  },
};

