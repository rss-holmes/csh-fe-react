import axios, { type AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from './constants'
import { useAuthStore } from '@/stores/authStore'

const requestConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
}

const axiosInstance = axios.create(requestConfig)

// Request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const authStore = useAuthStore.getState()
      authStore.logout()
      // Redirect to login will be handled by the router
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosInstance