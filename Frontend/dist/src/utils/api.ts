import axios from "axios";
import { baseURL, endpoints } from "./config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({ baseURL });

const refreshToken = async () => {
  const rawToken = await AsyncStorage.getItem("refresh_token");
  const refresh = rawToken?.replace(/^['"]+|['"]+$/g, "");
  if (!refresh) return null;

  try {
    const oldAccess = await AsyncStorage.getItem("access_token");
    const res = await api.post(
      endpoints.REFRESH_TOKEN,
      { refresh },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: oldAccess ? `Bearer ${oldAccess}` : "",
        },
      }
    );
//console.log(res.data,"=============rs===")
    const newAccess = res.data?.data?.access;
    const newRefresh = res.data?.data?.refresh;

    if (newAccess) await AsyncStorage.setItem("access_token", newAccess);
    if (newRefresh) await AsyncStorage.setItem("refresh_token", newRefresh);

    return newAccess;
  } catch (err) {
    console.error("Refresh failed", err);
    return null;
  }
};

// Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
//console.log("error======e")
      const newAccess = await refreshToken();
      if (newAccess) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
