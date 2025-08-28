import axios from "axios";

export const api = axios.create({
  baseURL: "https://socmed-backend-arcp.onrender.com/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  
