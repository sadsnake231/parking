import React, { useState } from 'react';
import axios from 'axios';

function TollRoads() {
    const [tollRoads, setTollRoads] = useState([]);
    const [error, setError] = useState('');
    const [paymentData, setPaymentData] = useState({ id: '', type: '' });
    const [paymentMessage, setPaymentMessage] = useState('');

    const loadTollData = async () => {
        try {
            setError('');
            const response = await axios.get('http://localhost:5000/tollroads', { withCredentials: true });
            setTollRoads(response.data);
        } catch (err) {
            setError('Ошибка при загрузке данных. Попробуйте снова.');
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
            const response = await axios.post('http://localhost:5000/tollroads/pay', {
                id: idAsNumber,
                type: paymentData.type
            }, { withCredentials: true });

            setPaymentMessage('Оплата прошла успешно!');
        } catch (err) {
            setPaymentMessage('Ошибка при оплате. Попробуйте снова.');
        }
    };

    return (
        <div>
            <h2>Страница платных дорог</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={loadTollData}>Загрузить данные</button>
                <div style={{ marginLeft: '20px', fontSize: '18px' }}>Оплата</div>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {tollRoads.length > 0 ? (
                    <ul>
                        {tollRoads.map((road) => (
                            <li key={road.id} style={{ marginBottom: '10px' }}>
                                <div><strong>Тип дороги:</strong> {road.type}</div>
                                <div><strong>ID:</strong> {road.id}</div>
                                <div><strong>Статус оплаты:</strong> {road.status ? 'Оплачено' : 'Не оплачено'}</div>
                                <div><strong>Дата проезда:</strong> {road.date}</div>
                                <div><strong>UIN:</strong> {road.uin}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Данных о платных дорогах нет.</p>
                )}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Оплата</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={paymentData.id}
                        onChange={handlePaymentChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="type">Платная дорога:</label>
                    <select
                        name="type"
                        id="type"
                        value={paymentData.type}
                        onChange={handlePaymentChange}
                    >
                        <option value="">Выберите тип дороги</option>
                        <option value="MCD">MCD</option>
                        <option value="Bagration">Bagration</option>
                    </select>
                </div>
                <button onClick={handlePayment}>Далее</button>

                {paymentMessage && <p>{paymentMessage}</p>}
            </div>
        </div>
    );
}

export default TollRoads;
