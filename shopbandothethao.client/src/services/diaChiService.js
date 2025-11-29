import api from './api';

export const diaChiService = {
  getDanhSach: async () => {
    const response = await api.get('/diachi');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/diachi/${id}`);
    return response.data;
  },

  themDiaChi: async (data) => {
    const response = await api.post('/diachi', data);
    return response.data;
  },

  capNhatDiaChi: async (id, data) => {
    const response = await api.put(`/diachi/${id}`, data);
    return response.data;
  },

  xoaDiaChi: async (id) => {
    const response = await api.delete(`/diachi/${id}`);
    return response.data;
  },

  datMacDinh: async (id) => {
    const response = await api.put(`/diachi/${id}/macdinh`);
    return response.data;
  },
};




