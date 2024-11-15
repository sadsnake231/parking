import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import Troika from './components/Troika';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>
          <h1>Welcome</h1>
          <SignupForm />
          <LoginForm />
        </div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/troika" element={<Troika />} />
      </Routes>
    </Router>
  );
}

export default App;
