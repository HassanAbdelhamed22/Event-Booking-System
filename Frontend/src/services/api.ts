import axios from "axios";
import { removeUserData } from "../utils/helpers";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiry globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.error("Unauthorized access:", error);

      // Clear user data and redirect to login page
      removeUserData();
      window.open("/login", "_blank"); // Open login page in a new tab
    }
    return Promise.reject(error);
  }
);

export default api;
