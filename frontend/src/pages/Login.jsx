import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.scss";

const Login = () => {
  const navigate = useNavigate(); // Хук для навигации
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/register" : "/api/login";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ошибка запроса");

      alert(isRegister ? "Регистрация успешна!" : "Вход выполнен!");
      navigate("/"); // После успешного входа переходим на главную
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-container">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Логин"
            value={formData.username}
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
        <button className="close-btn" onClick={() => navigate("/")}>Закрыть</button>
      </div>
    </div>
  );
};

export default Login;