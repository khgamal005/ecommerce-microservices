import axios from 'axios';

let isRefreshing: boolean = false;
let refreshSubscribers: (() => void)[] = [];

const handleLogout = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});



const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Request interceptor: attach access token from localStorage or cookies
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration or global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        isRefreshing = false;
        onRefreshSuccess();
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;