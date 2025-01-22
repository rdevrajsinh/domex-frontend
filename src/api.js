import axios from 'axios';

const api = axios.create({
  baseURL: 'https://flask-backend-bo88nik56-devrajs-projects-bdcfaf7a.vercel.app/api', // Your backend URL
  timeout: 5000,
});
/*
// Intercept requests to add Authorization header with token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const getAllDomains = () => api.get('/domains');
export const addDomain = (data) => api.post('/domain', data);
export const deleteDomain = (id) => api.delete(`/domain/${id}`);
