import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    carNumber: '',
    sts: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      setMessage(`Регистрация прошла успешно!`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Ошибка при регистрации. Проверьте все поля');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={headerStyle}>Регистрация</h2>
      {message && <p style={messageStyle}>{message}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Номер телефона:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Почта:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Номер автомобиля:</label>
          <input
            type="text"
            name="carNumber"
            value={formData.carNumber}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>СТС:</label>
          <input
            type="text"
            name="sts"
            value={formData.sts}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <button type="submit" style={buttonStyle}>Зарегистрироваться</button>
      </form>
    </div>
  );
};

const formContainerStyle = {
  width: "100%",
  maxWidth: "500px", // Увеличим максимальную ширину
  margin: "0 auto",
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
  flexDirection: "column",
  gap: "15px", // Добавляем промежутки между полями
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "16px",
  width: "100%",
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

const messageStyle = {
  color: "red",
  textAlign: "center",
};

export default SignupForm;
