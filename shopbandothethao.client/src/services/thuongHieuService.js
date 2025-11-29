import api from './api';

export const thuongHieuService = {
  getDanhSach: async () => {
    const response = await api.get('/thuonghieu');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/thuonghieu/${id}`);
    return response.data;
  },
};



