import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setIsAuthenticated, setUser }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем предыдущую ошибку

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          phone,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { user_id, user_name } = response.data;
        setIsAuthenticated(true);
        setUser({ id: user_id, name: user_name });
        navigate("/profile"); // Перенаправление в профиль
      }
    } catch (err) {
      setError("Неверные данные. Попробуйте снова");
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={headerStyle}>Вход</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Номер телефона:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Вход</button>
      </form>
    </div>
  );
}

const formContainerStyle = {
  width: "100%", // Форма будет занимать всю ширину контейнера
  maxWidth: "400px", // Максимальная ширина формы
  margin: "0 auto", // Центрируем форму по горизонтали
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column", // Выстраиваем элементы формы в столбик
  gap: "15px", // Добавляем промежутки между полями
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "column", // Столбик для метки и поля ввода
};

const labelStyle = {
  marginBottom: "5px", // Немного поднимаем метки
  fontWeight: "bold",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "16px",
  width: "100%", // Убедимся, что поля не выходят за пределы контейнера
};

const buttonStyle = {
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

export default LoginForm;
