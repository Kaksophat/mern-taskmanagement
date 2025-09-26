import axios  from "axios"
import { BASE_URL } from "./apipaths"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

axiosInstance.interceptors.request.use((config => {
   const accessToken = localStorage.getItem('token');
   if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
   }
    return config;
}), (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            window.location.href = '/login'; // Redirect to login page
        }else if (error.response.status === 403) {
            window.location.href = '/unauthorized'; // Redirect to unauthorized page
        }
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
});

export default axiosInstance;