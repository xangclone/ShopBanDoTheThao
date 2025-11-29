import api from './api';

const popupService = {
  getPopup: async () => {
    const response = await api.get('/popup');
    return response.data;
  },
};

export default popupService;





