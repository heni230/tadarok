import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../App.css';

export default function StudentLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert('📌 الرجاء إدخال كل البيانات');
      return;
    }

    try {
      const snap = await getDocs(collection(db, 'students'));
      const matchedDoc = snap.docs.find(doc => {
        const data = doc.data();
        return data.phone === phone && data.password === password;
      });

      if (matchedDoc) {
        const student = matchedDoc.data();

        // 🧠 تخزين بيانات التلميذ في localStorage
        localStorage.setItem('studentPhone', student.phone);
        localStorage.setItem('studentName', student.name || 'تلميذ');

        navigate('/dashboard');
      } else {
        alert('❌ رقم الهاتف أو كلمة السر غير صحيحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('⚠️ حدث خطأ غير متوقع أثناء محاولة الدخول');
    }
  };

  return (
    <div className="container">
      <h2>👨‍🎓 دخول التلميذ</h2>

      <form onSubmit={handleLogin}>
        <input
          type="tel"
          placeholder="📱 رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="🔒 كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">➡️ دخول</button>
      </form>
    </div>
  );
}
