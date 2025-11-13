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
    const orginalRequest = error.config;   
    if (error.response.status === 401 && !orginalRequest) {
      isRefreshing = true;
      try {
        const response = await axiosInstance.post("/refresh-token");
        isRefreshing = false;
        onRefreshSuccess();
        return axiosInstance.request(orginalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        if (refreshError.response.status === 401) {
          handleLogout();
          return Promise.reject(refreshError);
        }
        return Promise.reject(refreshError);
      }
    }
   
  }
);

export default axiosInstance;
