import React, { useState } from 'react';
import axios from 'axios';

function Parking() {
    const [sessionData, setSessionData] = useState(null);
    const [error, setError] = useState('');
    const [district, setDistrict] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [benefitId, setBenefitId] = useState(''); // Состояние для ID льготы

    const loadSession = async () => {
        try {
            setError('');
            const response = await axios.get('http://localhost:5000/parking/session', { withCredentials: true });

            if (response.data) {
                setSessionData(response.data);
                setSessionId(response.data.Session.Id); // Сохраняем sessionId
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
                { withCredentials: true }
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
                { data: { Pid: sessionId, Bid: bid }, withCredentials: true }
            );
            setSessionData(null);
            setError('Сессия успешно завершена.');
        } catch (err) {
            setError('Не удалось завершить сессию.');
        }
    };

    return (
        <div>
            <h2>Parking</h2>
            <div>
                <button onClick={loadSession}>Загрузить сессию</button>
            </div>

            <div>
                <h3>Создать новую сессию</h3>
                <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Номер зоны"
                    disabled={!!sessionData} // Блокируем поле, если сессия активна
                />
                <button onClick={startSession} disabled={!!sessionData}>
                    Начать
                </button>
            </div>

            <div>
                <h3>Завершить сессию и активировать льготу</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                        <input
                            type="text"
                            value={benefitId}
                            onChange={(e) => setBenefitId(e.target.value)}
                            placeholder="Введите ID льготы (по желанию)"
                        />
                    </div>
                    <div>
                        <button onClick={endSession} style={{ marginLeft: '10px' }}>
                            Завершить сессию
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3>Данные сессии</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {sessionData ? (
                    <div>
                        <p>Идентификатор сессии: {sessionData.Session.Id}</p>
                        <p>Время начала: {sessionData.Session.StartTime}</p>
                        <p>Зона парковки: {sessionData.Parking.District}</p>
                        <p>Стоимость: {sessionData.Parking.Cost}</p>
                        <h4>Льготы</h4>
                        <ul>
                            {sessionData.Benefits.map((benefit) => (
                                <li key={benefit.id}>
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

export default Parking;
    