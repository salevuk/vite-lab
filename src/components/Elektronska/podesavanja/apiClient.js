import axios from 'axios';

export const makeRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const makeKisRequest = axios.create({
    baseURL: import.meta.env.VITE_API_KIS_URL,
    withCredentials: true,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
    }
});

makeRequest.interceptors.response.use(response=>response.data);
makeKisRequest.interceptors.response.use(response=>response.data);