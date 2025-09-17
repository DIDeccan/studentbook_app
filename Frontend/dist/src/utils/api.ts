import axios from "axios";
import { baseURL, endpoints } from "./config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL,
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from storage
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        // Call refresh token API
        const res = await axios.post(endpoints.REFRESH_TOKEN, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;

        // Save new token
        await AsyncStorage.setItem("access_token", newAccessToken);

        // Update header & retry the request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed → logout user
        console.log("Refresh token failed", refreshError);
        // handle logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;