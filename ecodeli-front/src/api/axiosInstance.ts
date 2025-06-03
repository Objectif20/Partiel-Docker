import axios from "axios";
import { store } from "../redux/store";
import { login, logout } from "../redux/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const publicEndpoints = ["/client/auth/2fa/login"];

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken && config.url && !publicEndpoints.includes(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !publicEndpoints.includes(originalRequest.url)) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/client/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newAccessToken = data.access_token;

        store.dispatch(login({
          accessToken: newAccessToken,
          twoFactorRequired: false
        }));

        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        //window.location.href = "/client/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
