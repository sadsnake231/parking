import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // базовый URL вашего сервера
  withCredentials: true,           // включаем отправку куки
});

export default axiosInstance;
