import api from './api';

const transactionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  add: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/transactions/summary');
    return response.data;
  },
};

export default transactionService;
