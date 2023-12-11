//apiService

import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.apiUrl + '/api'; 

const apiService = {
  get: async (endpoint, token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params, 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
