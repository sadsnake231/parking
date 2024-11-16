import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Fines() {
  const [fines, setFines] = useState([]);
  const [error, setError] = useState("");
  const [uin, setUin] = useState(""); // Для ввода номера штрафа
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  const handleFindFines = async () => {
    setError(""); // Сброс ошибки
    try {
      const response = await axios.get("http://localhost:5000/fines", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setFines(response.data);
      }
    } catch (err) {
      setError("Не удалось загрузить штрафы. Попробуйте снова.");
    }
  };

  const handlePayFine = async () => {
    if (!uin) {
      setPaymentStatus("Введите номер штрафа.");
      return;
    }

    try {
      // Отправка POST запроса на оплату штрафа
      const response = await axios.post(
        "http://localhost:5000/fines/pay",
        { uin }, // тело запроса с номером штрафа
        { withCredentials: true } // передаем куки, если необходимо
      );

      if (response.status === 200) {
        setPaymentStatus("Штраф оплачен!");
      } else {
        setPaymentStatus("Не удалось оплатить штраф.");
      }
    } catch (err) {
      setPaymentStatus("Ошибка при оплате. Попробуйте снова.");
    }
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/profile")} style={backButtonStyle}>
        Назад
      </button>

      <h2 style={headerStyle}>Ваши штрафы</h2>
      <button onClick={handleFindFines} style={buttonStyle}>
        Найти штрафы
      </button>

      {error && <p style={errorStyle}>{error}</p>}

      {/* Если штрафов нет, показываем сообщение */}
      {fines && fines.length > 0 ? (
        <ul style={listStyle}>
          {fines.map((fine) => (
            <li key={fine.id} style={listItemStyle}>
              <p>Номер штрафа: {fine.uin}</p>
              <p>Дата: {fine.datetime}</p>
              <p>Сумма: {fine.sum}</p>
              <p>Статус: {fine.status ? "Оплачен" : "Не оплачен"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={messageStyle}>Штрафов нет</p>
      )}

      {/* Форма для оплаты штрафа */}
      <div style={formContainerStyle}>
        <h3>Оплатить штраф</h3>
        <input
          type="text"
          value={uin}
          onChange={(e) => setUin(e.target.value)}
          placeholder="Введите номер штрафа (UIN)"
          style={inputStyle}
        />
        <button onClick={handlePayFine} style={buttonStyle}>
          Далее
        </button>

        {paymentStatus && <p style={statusStyle}>{paymentStatus}</p>}
      </div>
    </div>
  );
}

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

// Стили для ошибки
const errorStyle = {
  color: "red",
  fontSize: "16px",
  marginTop: "10px",
};

// Стили для списка штрафов
const listStyle = {
  listStyleType: "none",
  padding: "0",
  textAlign: "left",
  marginBottom: "20px",
};

// Стили для элемента списка штрафов
const listItemStyle = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
};

// Стили для формы
const formContainerStyle = {
  marginTop: "20px",
  marginBottom: "20px",
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
  marginBottom: "20px",
};

// Стили для сообщения об оплате
const statusStyle = {
  marginTop: "10px",
  fontSize: "16px",
  fontWeight: "bold",
};

// Стили для сообщения "Штрафов нет"
const messageStyle = {
  fontSize: "16px",
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
  marginBottom: "20px",  // Убираем marginTop, чтобы она была сверху
  textDecoration: "none",
};

export default Fines;
