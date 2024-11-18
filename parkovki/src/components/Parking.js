import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Parking() {
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');
  const [district, setDistrict] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [benefitId, setBenefitId] = useState('');
  const navigate = useNavigate();

  const loadSession = async () => {
    try {
      setError('');
      const response = await axios.get('http://localhost:5000/parking/session', { withCredentials: true });

      // Проверяем наличие parkingsession в ответе
      if (response.data && response.data.parkingsession) {
        setSessionData(response.data); // Сохраняем все данные ответа
        setSessionId(response.data.parkingsession.Id); // Сохраняем sessionId
      } else {
        setSessionData(null);
        setError('Нет активных сессий.');
      }
    } catch (err) {
      setSessionData(null);
      setError('Ошибка загрузки сессии. Попробуйте снова.');
    }
  };

  const startSession = async () => {
    // Проверка на наличие активной сессии
    if (sessionData) {
      setError('У вас уже есть активная сессия. Завершите её перед созданием новой.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/parking/new',
        { district },
        { withCredentials: true } //начинаем парковку
      );
      setError('');
      setError('Сессия успешно создана. Нажмите "Загрузить сессию", чтобы увидеть данные.');
    } catch (err) {
      setError('Не удалось начать сессию. Проверьте данные.');
    }
  };

  const endSession = async () => {
    if (!sessionId) {
      setError('Нет активной сессии для завершения.');
      return;
    }

    const bid = benefitId || null; // Если льгота не введена, передаем null

    try {
      await axios.delete(
        `http://localhost:5000/parking/session/end`,
        { data: { Pid: sessionId, Bid: bid }, withCredentials: true } //завершаем сессию
      );
      setSessionData(null);
      setError('Сессия успешно завершена.');
    } catch (err) {
      setError('Не удалось завершить сессию.');
    }
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/profile")} style={backButtonStyle}>
        Назад
      </button>

      <h2 style={headerStyle}>Парковки</h2>

      <button onClick={loadSession} style={buttonStyle}>
        Загрузить сессию
      </button>

      <div style={formContainerStyle}>
        <h3>Создать новую сессию</h3>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Номер зоны"
          disabled={!!sessionData} // Блокируем поле, если сессия активна
          style={inputStyle}
        />
        <button onClick={startSession} disabled={!!sessionData} style={buttonStyle}>
          Начать
        </button>
      </div>

      <div style={formContainerStyle}>
        <h3>Завершить сессию и применить льготу</h3>
        
        {/* Поле для ID льготы теперь расположено над кнопкой */}
        <input
          type="text"
          value={benefitId}
          onChange={(e) => setBenefitId(e.target.value)}
          placeholder="Введите ID льготы (по желанию)"
          style={inputStyle}
        />
        
        {/* Контейнер для кнопки "Завершить сессию" с выравниванием по центру */}
        <div style={buttonContainerStyle}>
          <button onClick={endSession} style={buttonStyle}>
            Завершить сессию
          </button>
        </div>
      </div>

      <div style={sessionData ? {} : { marginTop: '20px' }}>
        <h3>Данные сессии</h3>
        {error && <p style={errorStyle}>{error}</p>}
        {sessionData ? (
          <div>
            <p>Идентификатор сессии: {sessionData.parkingsession.Id}</p>
            <p>Время начала: {sessionData.parkingsession.starttime}</p>
            <p>Зона парковки: {sessionData.parking.district}</p>
            <p>Стоимость: {sessionData.parking.Cost}</p>
            <h4>Льготы</h4>
            <ul style={listStyle}>
              {sessionData.benefits.map((benefit) => (
                <li key={benefit.id} style={listItemStyle}>
                  ID: {benefit.id}, Номер: {benefit.number}, Район: {benefit.district}, 
                  Действительна до: {benefit.validity}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !error && <p>Нет данных для отображения.</p>
        )}
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

// Стили для контейнера кнопки
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '10px',
};

// Стили для сообщения об ошибке
const errorStyle = {
  color: "red",
  fontSize: "16px",
  marginTop: "10px",
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
  marginBottom: "20px", // Убираем marginTop, чтобы она была сверху
  textDecoration: "none",
};

export default Parking;
