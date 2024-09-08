import axios from "axios";
import { backendBaseUrl } from "../config";

export const backend = axios.create({
  baseURL: backendBaseUrl,
  timeout: 20000,
});
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
