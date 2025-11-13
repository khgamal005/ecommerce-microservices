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

// Request interceptor: attach access token from localStorage or cookies
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach token from localStorage
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration or global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Token may be expired.");
      // Optional: redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
