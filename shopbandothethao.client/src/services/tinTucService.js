import api from './api';

const tinTucService = {
  async getDanhSach(loai = null, page = 1, pageSize = 10) {
    const params = { page, pageSize };
    if (loai) params.loai = loai;
    const response = await api.get('/tintuc', { params });
    return response.data;
  },

  async getNoiBat(limit = 6) {
    const response = await api.get('/tintuc/noibat', { params: { limit } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/tintuc/${id}`);
    return response.data;
  },
};

export { tinTucService };

