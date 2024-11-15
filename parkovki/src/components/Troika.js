import React, { useState } from 'react';

function Troika() {
  const [showInput, setShowInput] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleBindCardClick = () => {
    setShowInput(true);
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleBindCardSubmit = async () => {
    if (cardNumber.trim() === '') {
      setError('Введите номер карты!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/troika/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: cardNumber }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при привязке карты');
      }

      const data = await response.json();
      setSuccessMessage('Карта успешно привязана!');
      setCardNumber('');
      setShowInput(false);
    } catch (err) {
      setError(err.message || 'Не удалось связаться с сервером');
    }
  };

  return (
    <div>
      <h2>Тройка</h2>
      <p>Информация о карточке Тройка будет отображаться здесь.</p>
      
      <button onClick={handleBindCardClick}>Привязать новую карту</button>
      
      {showInput && (
        <div>
          <input
            type="text"
            placeholder="Введите номер карты"
            value={cardNumber}
            onChange={handleInputChange}
          />
          <button onClick={handleBindCardSubmit}>OK</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default Troika;
