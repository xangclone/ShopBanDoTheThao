import api from './api';

export const donHangService = {
  getDanhSach: async () => {
    const response = await api.get('/donhang');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/donhang/${id}`);
    return response.data;
  },

  taoDonHang: async (data) => {
    const response = await api.post('/donhang', data);
    return response.data;
  },

  huyDonHang: async (id) => {
    const response = await api.put(`/donhang/${id}/huy`);
    return response.data;
  },

  hoanTraDonHang: async (id, lyDo) => {
    const response = await api.put(`/donhang/${id}/hoan-tra`, { lyDo });
    return response.data;
  },

  capNhatTracking: async (id, data) => {
    const response = await api.put(`/donhang/${id}/tracking`, data);
    return response.data;
  },
};



