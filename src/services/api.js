import axios from 'axios';

// Get the environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Default to localhost if no node URL is set
let API_BASE_URL = isDevelopment ? 'http://localhost:5001' : '';

export const setNodeUrl = (nodeUrl) => {
  API_BASE_URL = `http://${nodeUrl}`;
};

const blockchainAPI = {
  getChain: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chain`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chain:', error);
      throw error;
    }
  },

  mine: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mine`);
      return response.data;
    } catch (error) {
      console.error('Error mining block:', error);
      throw error;
    }
  },

  getNodes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nodes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nodes:', error);
      throw error;
    }
  },

  sync: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sync`);
      return response.data;
    } catch (error) {
      console.error('Error syncing chain:', error);
      throw error;
    }
  }
};

export default blockchainAPI; 