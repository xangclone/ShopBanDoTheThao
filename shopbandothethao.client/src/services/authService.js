import api from './api';

export const authService = {
  dangKy: async (data) => {
    const response = await api.post('/auth/dangky', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.nguoiDung));
    }
    return response.data;
  },

  dangNhap: async (data) => {
    const response = await api.post('/auth/dangnhap', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.nguoiDung));
    }
    return response.data;
  },

  dangXuat: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  googleLogin: async (data) => {
    const response = await api.post('/auth/google', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.nguoiDung));
    }
    return response.data;
  },

  facebookLogin: async (data) => {
    const response = await api.post('/auth/facebook', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.nguoiDung));
    }
    return response.data;
  },

  quenMatKhau: async (email) => {
    const response = await api.post('/auth/quen-mat-khau', { email });
    return response.data;
  },

  resetMatKhau: async (token, tokenId, matKhau) => {
    const response = await api.post('/auth/reset-mat-khau', {
      token,
      tokenId,
      matKhau,
    });
    return response.data;
  },
};

