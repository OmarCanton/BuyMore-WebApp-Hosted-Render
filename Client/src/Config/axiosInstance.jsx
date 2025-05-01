import axios from "axios";
import { store } from "../Redux/Store/store";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store?.getState()
        const token = state?.persistedReducer.auth.token
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, 
    (err) => {
        return Promise.reject(err)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (err) => {
        const origninalRequest = err.config
        if(err.response?.status === 401 && !origninalRequest._retry) {
            origninalRequest._retry = true
            const state = store?.getState()
            const token = state?.persistedReducer?.auth?.token
            if(token) {
                origninalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosInstance(origninalRequest)
        }
    }
)


export default axiosInstance