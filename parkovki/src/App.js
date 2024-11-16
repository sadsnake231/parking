import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Fines from "./components/Fines";
import Troika from "./components/Troika";
import Benefits from "./components/Benefits";
import Parking from "./components/Parking"
import TollRoads from "./components/TollRoads"


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Welcome</h1>
              <LoginForm
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
              <SignupForm />
            </div>
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile user={user} /> : <h2>Access Denied</h2>}
        />
        <Route path="/troika" element={<Troika />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/tollroads" element={<TollRoads />} />
      </Routes>
    </Router>
  );
}

export default App;
