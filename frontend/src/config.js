// Configuration file for API endpoints
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
};

// Helper function to get the token
export const getAuthToken = () => localStorage.getItem('token');

export default config;