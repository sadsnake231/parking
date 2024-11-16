import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Troika = () => {
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState(""); // Для привязки карты
  const [sum, setSum] = useState(""); // Для суммы пополнения
  const [cardNumberToRecharge, setCardNumberToRecharge] = useState(""); // Для номера карты пополнения
  const navigate = useNavigate();

  // Загрузка привязанных карт
  const handleLoadCards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/troika", {
        withCredentials: true, // Для передачи cookies
      });

      console.log("Ответ сервера:", response.data); // Логируем данные от сервера
      if (Array.isArray(response.data)) {
        setCards(response.data); // Сохраняем массив карт в состояние
        setMessage("Карты успешно загружены!");
      } else {
        setMessage("Не удалось загрузить карты: неверный формат ответа");
      }
    } catch (error) {
      console.error("Ошибка загрузки карт:", error); // Логируем ошибку
      setMessage(error.response?.data?.error || "Ошибка загрузки карт");
    }
  };

  // Привязка новой карты
  const handleAddCard = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/troika/new",
        { number },
        { withCredentials: true }
      );
      setMessage(response.data.message || "Карта успешно привязана!");
      setNumber("");
    } catch (error) {
      console.error("Ошибка привязки карты:", error);
      setMessage(error.response?.data?.error || "Ошибка привязки карты");
    }
  };

  // Пополнение карты
  const handleRechargeCard = async () => {
    // Преобразование суммы в число
    const parsedSum = parseInt(sum, 10);

    // Проверка корректности введённой суммы
    if (isNaN(parsedSum) || parsedSum <= 0) {
      setMessage("Введите корректную сумму для пополнения");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/troika/putmoney",
        { sum: parsedSum, number: cardNumberToRecharge },
        { withCredentials: true }
      );
      setMessage(response.data.message || "Карта успешно пополнена!");
      setSum("");
      setCardNumberToRecharge("");
    } catch (error) {
      console.error("Ошибка пополнения карты:", error);
      setMessage(error.response?.data?.error || "Ошибка пополнения карты");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Тройка</h1>
      <button onClick={() => navigate("/profile")} style={backButtonStyle}>
        Назад
      </button>
      
      <div style={formContainerStyle}>
        <h2>Привязать новую карту</h2>
        <input
          type="text"
          placeholder="Номер карты"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAddCard} style={buttonStyle}>Привязать</button>
      </div>

      <div style={formContainerStyle}>
        <h2>Привязанные карты</h2>
        <button onClick={handleLoadCards} style={buttonStyle}>Загрузить</button>
        <ul style={listStyle}>
          {cards.map((card) => (
            <li key={card.id} style={listItemStyle}>
              Карта {card.number}, баланс: {card.balance}, срок действия:{" "}
              {card.validity}
            </li>
          ))}
        </ul>
      </div>

      <div style={formContainerStyle}>
        <h2>Пополнить карту</h2>
        <input
          type="text"
          placeholder="Номер карты"
          value={cardNumberToRecharge}
          onChange={(e) => setCardNumberToRecharge(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Сумма пополнения"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleRechargeCard} style={buttonStyle}>Пополнить</button>
      </div>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

// Стили для контейнера
const containerStyle = {
  width: "100%",
  maxWidth: "600px",
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

// Стили для кнопки "Назад"
const backButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "20px",
  textDecoration: "none",
};

// Стили для формы
const formContainerStyle = {
  marginBottom: "20px",
  textAlign: "center",
};

// Стили для полей ввода
const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  width: "80%",
  maxWidth: "400px",
};

// Стили для кнопок
const buttonStyle = {
  padding: "12px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "80%",
  maxWidth: "400px",
};

// Стили для списка карт
const listStyle = {
  listStyleType: "none",
  padding: "0",
  textAlign: "left",
};

// Стили для элемента списка карт
const listItemStyle = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
};

// Стили для сообщений
const messageStyle = {
  marginTop: "20px",
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
};

export default Troika;
