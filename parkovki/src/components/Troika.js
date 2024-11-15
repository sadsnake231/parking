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
    <div>
      <h1>Тройка</h1>
      <button onClick={() => navigate("/profile")}>Назад</button>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>Привязать новую карту</h2>
        <input
          type="text"
          placeholder="Номер карты"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button onClick={handleAddCard}>Привязать</button>
      </div>

      <div>
        <h2>Привязанные карты</h2>
        <button onClick={handleLoadCards}>Загрузить</button>
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              Карта {card.number}, баланс: {card.balance}, срок действия:{" "}
              {card.validity}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Пополнить карту</h2>
        <input
          type="text"
          placeholder="Номер карты"
          value={cardNumberToRecharge}
          onChange={(e) => setCardNumberToRecharge(e.target.value)}
        />
        <input
          type="number"
          placeholder="Сумма пополнения"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
        />
        <button onClick={handleRechargeCard}>Пополнить</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Troika;
