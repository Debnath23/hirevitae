import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log("API Request:", config.method?.toUpperCase(), config.url)
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)
