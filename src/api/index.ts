import axios from 'axios'
import { backendBaseUrl } from '../config'

export const backend = axios.create({
  baseURL: backendBaseUrl,
  timeout: process.env.NODE_ENV === 'development' ? 15000 : 15000,
})
backend.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken') // Assuming token is stored in localStorage
    const refreshToken = localStorage.getItem('refreshToken') // Assuming refresh token is stored in localStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
