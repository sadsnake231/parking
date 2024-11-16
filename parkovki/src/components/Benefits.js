import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Benefits() {
  const [district, setDistrict] = useState('');
  const [benefits, setBenefits] = useState(null); // Изменено на null для начального состояния
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmitBenefit = async (event) => {
    event.preventDefault();
    try {
      // Отправка POST запроса на сервер для создания новой льготы
      const response = await axios.post(
        'http://localhost:5000/benefits/new',
        { district },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert('Заявка на новую льготу подана!');
        setDistrict(''); // Сброс текстового поля после отправки
      }
    } catch (error) {
      setError('Ошибка при подаче заявки на льготу');
    }
  };

  const handleLoadBenefits = async () => {
    try {
      // Отправка GET запроса для получения льгот
      const response = await axios.get('http://localhost:5000/benefits', { withCredentials: true });
      setBenefits(response.data);
      setError(''); // Сброс ошибок при успешной загрузке
    } catch (error) {
      setBenefits(null); // Устанавливаем null при ошибке
      setError('Ошибка при загрузке льгот');
    }
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/profile")} style={backButtonStyle}>
        Назад
      </button>

      <h2 style={headerStyle}>Ваши льготы</h2>

      <button onClick={handleLoadBenefits} style={buttonStyle}>
        Загрузить льготы
      </button>

      <div>
        {benefits === null || benefits.length === 0 ? (
          <p style={messageStyle}>Нет доступных льгот</p>
        ) : (
          <ul style={listStyle}>
            {benefits.map((benefit) => (
              <li key={benefit.id} style={listItemStyle}>
                <p>Район: {benefit.district}</p>
                <p>Номер: {benefit.number}</p>
                <p>Срок действия: {benefit.validity}</p>
                <p>ID: {benefit.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={formContainerStyle}>
        <h3>Подать заявку на новую льготу</h3>
        <form onSubmit={handleSubmitBenefit}>
          <input
            type="text"
            placeholder="Район действия"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Подать заявку</button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}
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

// Стили для списка льгот
const listStyle = {
  listStyleType: "none",
  padding: "0",
  textAlign: "left",
  marginBottom: "20px",
};

// Стили для элемента списка льгот
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

// Стили для сообщения об ошибке
const errorStyle = {
  color: "red",
  fontSize: "16px",
  marginTop: "10px",
};

// Стили для сообщения "Нет доступных льгот"
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

export default Benefits;
