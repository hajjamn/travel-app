import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/.netlify/functions/", //L'url di base da cui fare le chiamate
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config before sending the request
    // For example, add authorization headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Modify response before returning it
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axiosInstance;
  },
};
