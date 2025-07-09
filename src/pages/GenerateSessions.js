import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';

export default function GenerateSessions() {
  const [auto, setAuto] = useState({
    name: '',
    weekDay: '1',
    time: '',
    count: 4
  });

  const [manual, setManual] = useState({
    name: '',
    date: '',
    time: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isTeacher = localStorage.getItem('isTeacher');
    if (!isTeacher) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAutoChange = e => setAuto({ ...auto, [e.target.name]: e.target.value });
  const handleManualChange = e => setManual({ ...manual, [e.target.name]: e.target.value });

  const generateRecurring = async () => {
    const { name, weekDay, time, count } = auto;
    if (!name || !time || !count) return alert('أدخل كل البيانات');

    const now = new Date();
    const currentMonth = now.getMonth();
    const year = now.getFullYear();
    const firstDay = new Date(year, currentMonth, 1);
    const matches = [];

    for (let d = new Date(firstDay); d.getMonth() === currentMonth; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === parseInt(weekDay)) {
        matches.push(new Date(d));
        if (matches.length === parseInt(count)) break;
      }
    }

    const [h, m] = time.split(':').map(Number);

    for (let date of matches) {
      date.setHours(h);
      date.setMinutes(m);
      const startTime = Timestamp.fromDate(new Date(date));
      const endTime = Timestamp.fromDate(new Date(date.getTime() + 60 * 60 * 1000));

      await addDoc(collection(db, 'sessions'), {
        name,
        startTime,
        endTime
      });
    }

    alert(`✔️ تم إنشاء ${matches.length} حصة بنجاح`);
    setAuto({ name: '', weekDay: '1', time: '', count: 4 });
  };

  const createManual = async () => {
    const { name, date, time } = manual;
    if (!name || !date || !time) return alert('أدخل كل البيانات');

    const fullDate = new Date(`${date}T${time}`);
    const startTime = Timestamp.fromDate(fullDate);
    const endTime = Timestamp.fromDate(new Date(fullDate.getTime() + 60 * 60 * 1000));

    await addDoc(collection(db, 'sessions'), {
      name,
      startTime,
      endTime
    });

    alert('✔️ تمت إضافة الحصة اليدوية');
    setManual({ name: '', date: '', time: '' });
  };

  return (
    <div style={container}>
      <h2>🔁 توليد حصص أسبوعية تلقائيًا</h2>
      <div style={box}>
        <input name="name" placeholder="اسم الحصة" value={auto.name} onChange={handleAutoChange} />
        <select name="weekDay" value={auto.weekDay} onChange={handleAutoChange}>
          <option value="0">الأحد</option>
          <option value="1">الاثنين</option>
          <option value="2">الثلاثاء</option>
          <option value="3">الأربعاء</option>
          <option value="4">الخميس</option>
          <option value="5">الجمعة</option>
          <option value="6">السبت</option>
        </select>
        <input name="time" type="time" value={auto.time} onChange={handleAutoChange} />
        <input name="count" type="number" min="1" max="6" value={auto.count} onChange={handleAutoChange} />
        <button onClick={generateRecurring}>➕ توليد الحصص</button>
      </div>

      <h2>✍️ إضافة حصة يدويًا</h2>
      <div style={box}>
        <input name="name" placeholder="اسم الحصة" value={manual.name} onChange={handleManualChange} />
        <input name="date" type="date" value={manual.date} onChange={handleManualChange} />
        <input name="time" type="time" value={manual.time} onChange={handleManualChange} />
        <button onClick={createManual}>➕ أضف حصة</button>
      </div>
    </div>
  );
}

const container = {
  maxWidth: 600,
  margin: '40px auto',
  padding: 20,
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  direction: 'rtl',
  textAlign: 'right'
};

const box = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginBottom: 30
};
