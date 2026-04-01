import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',  // Adjust to your Django URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: Attach Token
api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    const access = localStorage.getItem('access');
    const token = accessToken || access;

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] Token attached from ${accessToken ? 'accessToken' : 'access'} key`);
    } else {
      console.log(`[API Request] No valid token found in localStorage`);
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Handle 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("[API Response] 401 Unauthorized detected!");
      
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('access');
      
      // Redirect if not already on login/signup
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/signup')) {
        console.warn("Redirecting to login due to 401...");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
