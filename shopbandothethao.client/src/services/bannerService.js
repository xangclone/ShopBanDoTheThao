import api from './api';

export const bannerService = {
  getBanner: async () => {
    const response = await api.get('/banner');
    return response.data;
  },
};
