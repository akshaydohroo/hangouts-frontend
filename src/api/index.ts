import axios from "axios";

export const backend = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
});
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
