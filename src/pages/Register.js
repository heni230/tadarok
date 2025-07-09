import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('❗ كلمة السر غير متطابقة');
      return;
    }

    if (username.trim().length < 3 || password.trim().length < 4) {
      alert('⚠️ الرجاء إدخال اسم مستخدم وكلمة سر صالحة');
      return;
    }

    localStorage.setItem('isTeacher', 'true');
    localStorage.setItem('teacherUsername', username);
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="header-brand">📘 Kharoubi Tadarok</div>
      <h2 style={{ marginBottom: '24px' }}>✍️ تسجيل حساب أستاذ جديد</h2>

      <form onSubmit={handleRegister}>
        <label htmlFor="username">👤 اسم المستخدم:</label>
        <input
          id="username"
          type="text"
          placeholder="مثال: prof.khaled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">🔒 كلمة السر:</label>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirm">🔁 تأكيد كلمة السر:</label>
        <input
          id="confirm"
          type="password"
          placeholder="********"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">➡️ تسجيل</button>
      </form>

      <p style={{ marginTop: '24px', fontSize: '15px' }}>
        لديك حساب؟{' '}
        <span
          style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/login')}
        >
          دخول الآن
        </span>
      </p>
    </div>
  );
}
