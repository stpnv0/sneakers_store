import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import "../index.scss";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", 
    password: "",
    app_id: 1,
  });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (window.confirm("Вы уверены, что хотите закрыть форму?")) {
      navigate("/");
    }
  };
  
  const verifyToken = async (token) => {
    try {
      // Создаем новый экземпляр axios для тестового запроса
      const testAxios = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const response = await testAxios.get('/api/v1/favorites');
      console.log('Verification response:', response);
      return true;
    } catch (error) {
      console.error('Verification error:', error.response?.data);
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const endpoint = isRegister ? "/api/v1/auth/register" : "/api/v1/auth/login";
  
    try {
      // Шаг 1: Авторизация
      const response = await axios.post(endpoint, formData);
      const data = response.data;
      console.log('Auth response:', data);
      
      if (!isRegister) {
        if (!data.token) {
          throw new Error("Токен не получен от сервера");
        }
        
        // Шаг 2: Сохраняем токен
        localStorage.setItem("token", data.token);
        console.log('Token saved:', data.token);
        
        // Шаг 3: Проверяем сохранение
        const savedToken = localStorage.getItem("token");
        if (savedToken !== data.token) {
          throw new Error("Ошибка сохранения токена");
        }
        
        // Шаг 4: Проверяем токен
        const isValid = await verifyToken(savedToken);
        if (!isValid) {
          throw new Error("Ошибка проверки токена");
        }
        
        console.log('Token verification successful');
      }
      
      // Шаг 5: Завершаем процесс
      alert(isRegister ? "Регистрация успешна!" : "Вход выполнен!");
      
      // Принудительно обновляем страницу для сброса состояния приложения
      window.location.href = '/';
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Ошибка запроса";
      console.error('Error details:', errorMessage);
      setError(errorMessage);
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="login-modal">
      <div className="login-container">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email" 
            name="email" 
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="toggle">
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
        <button className="close-btn" onClick={handleClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default Login;