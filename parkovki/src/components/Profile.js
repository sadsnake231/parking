import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Если пользователь не вошел в систему, редирект на главную
  if (!userId) {
    navigate('/');
    return null;
  }

  const handleTroikaClick = () => {
    navigate('/troika');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <p>Your ID: {userId}</p>
      <button onClick={handleTroikaClick}>Тройка</button>
      <button>Штрафы</button>
      <button>Парковки</button>
      <button>Льготы</button>
      <button>Платные дороги</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
