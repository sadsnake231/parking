import React from "react";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div style={profileContainerStyle}>
      <h1 style={headerStyle}>Добро пожаловать в профиль</h1>
      <div style={buttonsContainerStyle}>
        <div style={buttonWithDescription}>
          <Link to="/troika" style={buttonStyle}>Тройка</Link>
          <p style={descriptionStyle}>Действия с привязанными картами "Тройка"</p>
        </div>
        <div style={buttonWithDescription}>
          <Link to="/fines" style={buttonStyle}>Штрафы</Link>
          <p style={descriptionStyle}>Просмотр и оплата штрафов</p>
        </div>
        <div style={buttonWithDescription}>
          <Link to="/benefits" style={buttonStyle}>Льготы</Link>
          <p style={descriptionStyle}>Просмотр и оформление льгот на парковку</p>
        </div>
        <div style={buttonWithDescription}>
          <Link to="/parking" style={buttonStyle}>Парковочная сессия</Link>
          <p style={descriptionStyle}>Начало парковочной сессии и её оплата</p>
        </div>
        <div style={buttonWithDescription}>
          <Link to="/tollroads" style={buttonStyle}>Платные дороги</Link>
          <p style={descriptionStyle}>Оплата проезда по платной дороге</p>
        </div>
        <div style={buttonWithDescription}>
          <button onClick={() => window.location.href = "/"} style={buttonStyle}>Выход</button>
          <p style={descriptionStyle}>Выход из аккаунта</p>
        </div>
      </div>
    </div>
  );
}

// Стили для контейнера профиля
const profileContainerStyle = {
  width: "100%",
  maxWidth: "600px", // Сделаем блок немного более компактным
  margin: "0 auto",
  padding: "20px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

// Стили для заголовка
const headerStyle = {
  marginBottom: "20px",
  fontSize: "24px",
  color: "#333",
};

// Стили для контейнера кнопок
const buttonsContainerStyle = {
  display: "flex",
  flexDirection: "column",  // Кнопки будут располагаться вертикально
  alignItems: "center",     // Выравнивание кнопок по центру
  gap: "25px",              // Добавляем отступ между кнопками
};

// Стили для блока с кнопкой и описанием
const buttonWithDescription = {
  display: "flex",
  flexDirection: "column",  // Кнопка и описание будут располагаться друг под другом
  alignItems: "center",     // Выравнивание по центру
  width: "100%",            // Ширина будет 100% доступного пространства
  textAlign: "center",      // Выравнивание текста по центру
};

// Стили для кнопок
const buttonStyle = {
  padding: "15px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  textDecoration: "none",  // Убираем подчеркивание у ссылок
  width: "100%",           // Кнопки растягиваются на всю ширину
  maxWidth: "300px",       // Максимальная ширина кнопки
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  display: "inline-block",
};

// Эффект при наведении на кнопку
buttonStyle[':hover'] = {
  backgroundColor: "#45a049", // Слегка темнее при наведении
};

// Стили для описания
const descriptionStyle = {
  fontSize: "16px",
  color: "#555",
  maxWidth: "300px",         // Ограничиваем ширину описания
  marginTop: "10px",         // Отступ сверху между кнопкой и описанием
  lineHeight: "1.5",
  textAlign: "center",       // Выравнивание описания по центру
};

export default Profile;
