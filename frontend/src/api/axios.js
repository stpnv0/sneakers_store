import axios from 'axios';

// Создаем базовую конфигурацию
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
    
    // Логируем информацию о запросе
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Current headers:', config.headers);
    
    // Убеждаемся, что заголовки существуют
    if (!config.headers) {
        config.headers = {};
    }
    
    // Устанавливаем базовые заголовки
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Token added to request');
        console.log('Final headers:', config.headers);
    } else {
        console.log('No token available');
    }
    
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Добавляем интерцептор для обработки ответов
instance.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            console.log('Unauthorized request detected');
            console.log('Request details:', {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            });
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default instance; 