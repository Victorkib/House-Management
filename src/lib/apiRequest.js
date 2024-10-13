import axios from 'axios';

// const devUrl = 'http://localhost:5500/api';
// const prodUrl = 'https://residential-0bacf0736179.herokuapp.com/api';
const prodUrl = 'https://house-management-backend.onrender.com/api';

const apiRequest = axios.create({
  baseURL: prodUrl,
  withCredentials: true,
});

export default apiRequest;
