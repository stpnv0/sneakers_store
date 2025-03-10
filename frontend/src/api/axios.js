import axios from 'axios';

// Базовая конфигурация
const config = {
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const instance = axios.create(config);

// Добавляем интерцептор для авторизации
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    // Убеждаемся, что заголовки существуют
    if (!config.headers) {
        config.headers = {};
    }
    
    // Устанавливаем базовые заголовки
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Добавляем интерцептор для обработки ответов
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // При ошибке авторизации удаляем токен
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default instance; 