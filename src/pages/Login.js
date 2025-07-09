// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'Emna' && password === 'marwen2024') {
      localStorage.setItem('isTeacher', 'true');
      localStorage.setItem('teacherUsername', username);
      navigate('/teacher-dashboard'); // ← توجيه للوحة تحكم الأستاذ
    } else {
      alert('❌ اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  return (
    <div className="container">
      <div className="header-brand">📘 Kharoubi Tadarok</div>
      <h2>🔑 دخول الأستاذ</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="👤 اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔒 كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">➡️ تسجيل الدخول</button>
      </form>
    </div>
  );
}
