import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setIsAuthenticated, setUser }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем предыдущую ошибку

    try {
      const response = await axios.post("http://localhost:5000/login", {
        phone,
        password,
      });

      if (response.status === 200) {
        const { user_id, user_name } = response.data;
        setIsAuthenticated(true);
        setUser({ id: user_id, name: user_name });
        navigate("/profile"); // Перенаправление в профиль
      }
    } catch (err) {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
