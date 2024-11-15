import React, { useState } from "react";
import axios from "axios";

function Fines() {
  const [fines, setFines] = useState([]);
  const [error, setError] = useState("");
  const [uin, setUin] = useState(""); // Для ввода номера штрафа
  const [paymentStatus, setPaymentStatus] = useState("");

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
    <div>
      <h2>Ваши штрафы</h2>
      <button onClick={handleFindFines}>Найти штрафы</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Если штрафов нет, показываем сообщение */}
      {fines && fines.length > 0 ? (
        <ul>
          {fines.map((fine) => (
            <li key={fine.id}>
              <p>Номер штрафа: {fine.uin}</p>
              <p>Дата: {fine.datetime}</p>
              <p>Сумма: {fine.sum}</p>
              <p>Статус: {fine.status ? "Оплачен" : "Не оплачен"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Штрафов нет</p>
      )}

      {/* Форма для оплаты штрафа */}
      <div>
        <h3>Оплатить штраф</h3>
        <input
          type="text"
          value={uin}
          onChange={(e) => setUin(e.target.value)}
          placeholder="Введите номер штрафа (UIN)"
        />
        <button onClick={handlePayFine}>Далее</button>

        {paymentStatus && <p>{paymentStatus}</p>}
      </div>

      <button onClick={() => window.history.back()}>Назад</button>
    </div>
  );
}

export default Fines;
