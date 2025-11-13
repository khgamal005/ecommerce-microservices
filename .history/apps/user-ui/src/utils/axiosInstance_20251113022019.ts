import axios from "axios";


let isRefreshing: boolean = false;
let refreshSubscribers: (() => void)[] = [];

const handleLogout=()=>{
  if(window.location.pathname!=='/login'){
    window.location.href='/login'
  }
}
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies automatically
});
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
}

const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];  
}

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
    if (error.response.status === 401 && !originalRequest._retry) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          resolve(axiosInstance(originalRequest));
        });
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const response = await axiosInstance.post(`${}`);
          onRefreshSuccess();
          return response;
        } catch (refreshError) {
          handleLogout()
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      })

     
    }
   
  }
);

export default axiosInstance;
