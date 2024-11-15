// src/components/SignupForm.js

import React, { useState } from 'react';

function SignupForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [car, setCar] = useState('');
  const [sts, setSts] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, phone, email, car, sts, password };

    console.log('User registered:', userData);
    
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => alert('User registered successfully!'))
      .catch((error) => alert('Error registering user: ' + error));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Car"
          value={car}
          onChange={(e) => setCar(e.target.value)}
        />
        <input
          type="text"
          placeholder="STS"
          value={sts}
          onChange={(e) => setSts(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignupForm;
