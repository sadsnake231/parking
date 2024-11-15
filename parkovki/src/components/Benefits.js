import React, { useState } from 'react';
import axios from 'axios';

function Benefits() {
  const [district, setDistrict] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [error, setError] = useState('');
  
  const handleSubmitBenefit = async (event) => {
    event.preventDefault();
    
    try {
      // Отправка POST запроса на сервер для создания новой льготы
      const response = await axios.post('http://localhost:5000/benefits/new', { district }, {withCredentials: true});
      
      if (response.status === 200) {
        alert("Заявка на новую льготу подана!");
      }
    } catch (error) {
      setError('Ошибка при подаче заявки на льготу');
    }
  };

  const handleLoadBenefits = async () => {
    try {
      // Отправка GET запроса для получения льгот
      const response = await axios.get('http://localhost:5000/benefits', {withCredentials: true});
      setBenefits(response.data);
    } catch (error) {
      setError('Ошибка при загрузке льгот');
    }
  };

  return (
    <div>
      <h2>Ваши льготы</h2>
      
      <button onClick={handleLoadBenefits}>Загрузить льготы</button>
      
      <div>
        {benefits.length > 0 ? (
          <ul>
            {benefits.map((benefit) => (
              <li key={benefit.id}>
                <p>Район: {benefit.district}</p>
                <p>Номер: {benefit.number}</p>
                <p>Срок действия: {benefit.validity}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет доступных льгот</p>
        )}
      </div>

      <div>
        <h3>Подать заявку на новую льготу</h3>
        <form onSubmit={handleSubmitBenefit}>
          <input
            type="text"
            placeholder="Район действия"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
          <button type="submit">Подать заявку</button>
        </form>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Benefits;
