import api from './api';

export const flashSaleService = {
  // Public APIs
  getFlashSaleDangDienRa: async () => {
    const response = await api.get('/flashsale/dang-dien-ra');
    return response.data;
  },

  getFlashSaleById: async (id) => {
    const response = await api.get(`/flashsale/${id}`);
    return response.data;
  },

  getFlashSaleBySanPhamId: async (sanPhamId) => {
    const response = await api.get(`/flashsale/sanpham/${sanPhamId}`);
    return response.data;
  },

  // Admin APIs
  getDanhSachFlashSale: async () => {
    const response = await api.get('/admin/flashsale');
    return response.data;
  },

  getFlashSaleByIdAdmin: async (id) => {
    const response = await api.get(`/admin/flashsale/${id}`);
    return response.data;
  },

  taoFlashSale: async (data) => {
    const response = await api.post('/admin/flashsale', data);
    return response.data;
  },

  capNhatFlashSale: async (id, data) => {
    const response = await api.put(`/admin/flashsale/${id}`, data);
    return response.data;
  },

  xoaFlashSale: async (id) => {
    const response = await api.delete(`/admin/flashsale/${id}`);
    return response.data;
  },

  themSanPhamVaoFlashSale: async (flashSaleId, data) => {
    const response = await api.post(`/admin/flashsale/${flashSaleId}/sanpham`, data);
    return response.data;
  },

  capNhatSanPhamTrongFlashSale: async (flashSaleId, sanPhamId, data) => {
    const response = await api.put(`/admin/flashsale/${flashSaleId}/sanpham/${sanPhamId}`, data);
    return response.data;
  },

  xoaSanPhamKhoiFlashSale: async (flashSaleId, sanPhamId) => {
    const response = await api.delete(`/admin/flashsale/${flashSaleId}/sanpham/${sanPhamId}`);
    return response.data;
  },
};

