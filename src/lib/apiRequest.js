import axios from 'axios';

// 'http://localhost:5500/api',
// 'https://residential-0bacf0736179.herokuapp.com/api',
const apiRequest = axios.create({
  baseURL: 'https://residential-0bacf0736179.herokuapp.com/api',
  withCredentials: true,
});

export default apiRequest;
