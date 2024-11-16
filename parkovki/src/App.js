import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Fines from "./components/Fines";
import Troika from "./components/Troika";
import Benefits from "./components/Benefits";
import Parking from "./components/Parking";
import TollRoads from "./components/TollRoads";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Портал Парковки</h1>
        </header>
        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="home-page">
                  <h2>Добро пожаловать!</h2>
                  <p>Войдите, чтобы получить доступ к персонализированным услугам.</p>
                  <div className="auth-forms">
                    <LoginForm
                      setIsAuthenticated={setIsAuthenticated}
                      setUser={setUser}
                    />
                    <SignupForm />
                  </div>
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Profile user={user} />
                ) : (
                  <h2 style={{ textAlign: "center" }}>Доступ запрещен</h2>
                )
              }
            />
            <Route path="/troika" element={<Troika />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/tollroads" element={<TollRoads />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} М8О-305Б-22. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
