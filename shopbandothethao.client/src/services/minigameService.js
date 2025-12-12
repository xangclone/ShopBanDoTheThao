import api from './api';

const minigameService = {
  // Lấy danh sách minigame
  getMinigames: async () => {
    const response = await api.get('/minigame');
    return response.data;
  },

  // Chơi minigame
  choiMinigame: async (id) => {
    const response = await api.post(`/minigame/${id}/choi`);
    return response.data;
  },

  // Lấy lịch sử chơi game
  getLichSuChoiGame: async (page = 1, pageSize = 20) => {
    const response = await api.get(`/minigame/lich-su?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
};

export default minigameService;








