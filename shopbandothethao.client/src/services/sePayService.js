import api from './api';

export const sePayService = {
  createPayment: async (donHangId) => {
    const response = await api.post('/sepay/create-payment', { donHangId });
    return response.data;
  },

  checkPaymentStatus: async (donHangId) => {
    const response = await api.get(`/sepay/check-status/${donHangId}`);
    return response.data;
  },
};

