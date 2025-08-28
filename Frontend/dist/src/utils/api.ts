import axios from "axios";
import { baseURL } from "./config/config";

const api = axios.create({
    baseURL,
});

export default api;