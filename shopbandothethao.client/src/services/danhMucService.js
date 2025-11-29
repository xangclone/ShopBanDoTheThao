import api from './api';

export const danhMucService = {
  getDanhSach: async () => {
    const response = await api.get('/danhmuc');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/danhmuc/${id}`);
    return response.data;
  },
};




