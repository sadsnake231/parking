import React from "react";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div>
      <h1>Добро пожаловать в профиль</h1>
      <div>
        <button>
          <Link to="/troika">Тройка</Link>
        </button>
        <button>
          <Link to="/fines">Штрафы</Link>
        </button>
        <button>
          <Link to="/benefits">Льготы</Link>
        </button>
        <button>
          <Link to="/parking">Парковочная сессия</Link>
        </button>
        <button>
          <Link to="/tollroads">Платные дороги</Link>
        </button>
        <button onClick={() => window.location.href = "/"}>Выход</button>
      </div>
    </div>
  );
}

export default Profile;
