import axios from "axios";
import { baseURL, endpoints } from "./config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL,
});
//console.log(baseURL,"ppppppppp")
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("error======123");
      originalRequest._retry = true;

      try {
        // 🔑 Get tokens from storage
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        const oldAccessToken = await AsyncStorage.getItem("access_token");

        if (!refreshToken || !oldAccessToken) {
          return Promise.reject(error); // no tokens → logout
        }

        // 🔑 Call refresh API
        const res = await axios.post(
          endpoints.REFRESH_TOKEN,
          { refresh: refreshToken }, // payload
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${oldAccessToken}`, // previous access token
            },
          }
        );

        console.log("Refresh API response:", res.data);

        // ✅ Correct response path
        const newAccessToken = res.data.data.access;
        const newRefreshToken = res.data.data.refresh;

        // 🔑 Save new tokens
        await AsyncStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem("refresh_token", newRefreshToken);
        }

        // 🔑 Retry original request with new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export default api;