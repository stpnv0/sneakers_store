import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const endpoint = isRegister 
      ? "http://localhost:8080/api/v1/auth/register" 
      : "http://localhost:8080/api/v1/auth/login";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data?.message || "Ошибка запроса";
        throw new Error(errorMessage);
      }
  
      // Для входа сохраняем токен
      if (!isRegister) {
        localStorage.setItem("token", data.token);
      }
      
      alert(isRegister ? "Регистрация успешна!" : "Вход выполнен!");
      navigate("/");
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