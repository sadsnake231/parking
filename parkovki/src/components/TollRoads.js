import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TollRoads() {
    const [tollRoads, setTollRoads] = useState(null); // Начальное значение null
    const [error, setError] = useState('');
    const [paymentData, setPaymentData] = useState({ id: '', type: '' });
    const [paymentMessage, setPaymentMessage] = useState('');
    const navigate = useNavigate();

    const loadTollData = async () => {
        try {
            setError('');
            const response = await axios.get('http://localhost:5000/tollroads', { withCredentials: true });
            // Фильтруем дороги, оставляем только те, что не оплачены
            const unpaidRoads = response.data.filter(road => !road.status);
            setTollRoads(unpaidRoads);
        } catch (err) {
            setError('Ошибка при загрузке данных. Попробуйте снова.');
            setTollRoads(null); // Устанавливаем null при ошибке
        }
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        if (!paymentData.id || !paymentData.type) {
            setPaymentMessage('Пожалуйста, заполните все поля.');
            return;
        }

        const idAsNumber = parseInt(paymentData.id, 10);
        if (isNaN(idAsNumber)) {
            setPaymentMessage('ID должен быть числом.');
            return;
        }

        try {
            await axios.post(
                'http://localhost:5000/tollroads/pay',
                { id: idAsNumber, type: paymentData.type },
                { withCredentials: true }
            );
            setPaymentMessage('Оплата прошла успешно!');
        } catch (err) {
            setPaymentMessage('Ошибка при оплате. Попробуйте снова.');
        }
    };

    return (
        <div style={containerStyle}>
            {/* Кнопка назад */}
            <button onClick={() => navigate("/profile")} style={backButtonStyle}>
                Назад
            </button>

            <h2 style={headerStyle}>Платные дороги</h2>

            <div style={buttonContainerStyle}>
                <button onClick={loadTollData} style={buttonStyle}>
                    Загрузить данные
                </button>
            </div>

            {error && <p style={errorStyle}>{error}</p>}

            <div>
                {tollRoads === null || tollRoads.length === 0 ? (
                    <p>Данных о платных дорогах нет.</p>
                ) : (
                    <ul style={listStyle}>
                        {tollRoads.map((road) => (
                            <li key={road.id} style={listItemStyle}>
                                <div><strong>Тип дороги:</strong> {road.type}</div>
                                <div><strong>ID:</strong> {road.id}</div>
                                <div><strong>Статус оплаты:</strong> {road.status ? 'Оплачено' : 'Не оплачено'}</div>
                                <div><strong>Дата проезда:</strong> {road.date}</div>
                                <div><strong>UIN:</strong> {road.uin}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={formContainerStyle}>
                <h3>Оплата</h3>
                <div style={inputContainerStyle}>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={paymentData.id}
                        onChange={handlePaymentChange}
                        style={inputStyle}
                    />
                </div>
                <div style={inputContainerStyle}>
                    <label htmlFor="type">Платная дорога:</label>
                    <select
                        name="type"
                        id="type"
                        value={paymentData.type}
                        onChange={handlePaymentChange}
                        style={selectStyle}
                    >
                        <option value="">Выберите тип дороги</option>
                        <option value="MCD">MCD</option>
                        <option value="Bagration">Bagration</option>
                    </select>
                </div>

                <button onClick={handlePayment} style={buttonStyle}>
                    Далее
                </button>

                {paymentMessage && <p>{paymentMessage}</p>}
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

// Стили для списка данных о платных дорогах
const listStyle = {
    listStyleType: "none",
    padding: "0",
    textAlign: "left",
    marginBottom: "20px",
};

// Стили для элемента списка данных
const listItemStyle = {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
};

// Стили для формы
const formContainerStyle = {
    marginTop: "20px",
};

// Стили для контейнера с input
const inputContainerStyle = {
    marginBottom: "20px", // Увеличим отступ между полями
    display: "flex",
    flexDirection: "column", // Поля будут располагаться друг под другом
    alignItems: "center", // Центрируем элементы
    width: "100%", // Делаем форму на всю ширину
};

// Стили для полей ввода
const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "80%",
    maxWidth: "400px",
};

// Стили для select
const selectStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
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
    marginBottom: "20px",
    textDecoration: "none",
};

// Стили для текста рядом с кнопкой
const textStyle = {
    marginLeft: '20px',
    fontSize: '18px',
};

export default TollRoads;
