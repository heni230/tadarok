import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, Timestamp, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import BackToDashboard from '../components/BackToDashboard';
import '../App.css';

export default function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [auto, setAuto] = useState({
    name: '',
    weekDay: '1',
    startTime: '',
    endTime: '',
    count: 4
  });

  const [manual, setManual] = useState({
    name: '',
    date: '',
    start: '',
    end: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isTeacher = localStorage.getItem('isTeacher');
    if (!isTeacher) {
      navigate('/login');
    } else {
      deleteExpiredSessions();
      fetchSessions();
    }
  }, []);

  const deleteExpiredSessions = async () => {
    const snap = await getDocs(collection(db, 'sessions'));
    for (let docu of snap.docs) {
      const data = docu.data();
      if (data.endTime && data.endTime.toMillis() < Date.now()) {
        await deleteDoc(doc(db, 'sessions', docu.id));
      }
    }
  };

  const fetchSessions = async () => {
    const snap = await getDocs(collection(db, 'sessions'));
    const list = snap.docs.map(docu => {
      const d = docu.data();
      return {
        id: docu.id,
        name: d.name,
        startTime: d.startTime?.seconds ? new Date(d.startTime.seconds * 1000) : null,
        endTime: d.endTime?.seconds ? new Date(d.endTime.seconds * 1000) : null
      };
    });
    setSessions(list.sort((a, b) => a.startTime - b.startTime));
  };

  const handleAutoChange = e => setAuto({ ...auto, [e.target.name]: e.target.value });
  const handleManualChange = e => setManual({ ...manual, [e.target.name]: e.target.value });

  const generateSessions = async () => {
    const { name, weekDay, startTime, endTime, count } = auto;
    if (!name || !startTime || !endTime) return alert('يرجى إدخال كل البيانات');

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const first = new Date(year, month, 1);
    const dates = [];

    for (let d = new Date(first); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === parseInt(weekDay)) {
        dates.push(new Date(d));
        if (dates.length === parseInt(count)) break;
      }
    }

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    for (let d of dates) {
      const sessionStart = new Date(d.setHours(sh, sm));
      const sessionEnd = new Date(d.setHours(eh, em));
      if (sessionEnd <= sessionStart) return alert('⛔ نهاية الحصة يجب أن تكون بعد بدايتها');

      await addDoc(collection(db, 'sessions'), {
        name,
        startTime: Timestamp.fromDate(new Date(sessionStart)),
        endTime: Timestamp.fromDate(new Date(sessionEnd))
      });
    }

    alert(`✔️ تم إنشاء ${dates.length} حصة`);
    setAuto({ name: '', weekDay: '1', startTime: '', endTime: '', count: 4 });
    fetchSessions();
  };

  const addManualSession = async () => {
    const { name, date, start, end } = manual;
    if (!name || !date || !start || !end) return alert('يرجى إدخال كل البيانات');

    const startTime = new Date(`${date}T${start}`);
    const endTime = new Date(`${date}T${end}`);
    if (endTime <= startTime) return alert('⛔ نهاية الحصة يجب أن تكون بعد بدايتها');

    await addDoc(collection(db, 'sessions'), {
      name,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime)
    });

    alert('✔️ تمت إضافة الحصة اليدوية');
    setManual({ name: '', date: '', start: '', end: '' });
    fetchSessions();
  };

  const deleteSession = async (id) => {
    await deleteDoc(doc(db, 'sessions', id));
    fetchSessions();
  };

  const formatTime = (t) =>
    t?.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <div className="container">
      <BackToDashboard />

      <h2>📚 إدارة الحصص</h2>

      {/* 🔁 توليد تلقائي */}
      <form onSubmit={(e) => e.preventDefault()}>
        <h3>🔁 توليد حصص شهرية</h3>
        <input name="name" placeholder="اسم الحصة" value={auto.name} onChange={handleAutoChange} />
        <select name="weekDay" value={auto.weekDay} onChange={handleAutoChange}>
          <option value="0">الأحد</option>
          <option value="1">الإثنين</option>
          <option value="2">الثلاثاء</option>
          <option value="3">الأربعاء</option>
          <option value="4">الخميس</option>
          <option value="5">الجمعة</option>
          <option value="6">السبت</option>
        </select>
        <input name="startTime" type="time" value={auto.startTime} onChange={handleAutoChange} />
        <input name="endTime" type="time" value={auto.endTime} onChange={handleAutoChange} />
        <input name="count" type="number" min="1" max="10" value={auto.count} onChange={handleAutoChange} />
        <button onClick={generateSessions}>➕ توليد</button>
      </form>

      {/* ✍️ إضافة حصة يدويًا */}
      <form onSubmit={(e) => e.preventDefault()}>
        <h3>✍️ إضافة حصة يدوية</h3>
        <input name="name" placeholder="اسم الحصة" value={manual.name} onChange={handleManualChange} />
        <input name="date" type="date" value={manual.date} onChange={handleManualChange} />
        <input name="start" type="time" value={manual.start} onChange={handleManualChange} />
        <input name="end" type="time" value={manual.end} onChange={handleManualChange} />
        <button onClick={addManualSession}>✔️ أضف</button>
      </form>

      <h3>📅 قائمة الحصص</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>التاريخ</th>
            <th>بداية</th>
            <th>نهاية</th>
            <th>🗑️</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>{s.startTime?.toLocaleDateString('fr-TN')}</td>
              <td>{formatTime(s.startTime)}</td>
              <td>{formatTime(s.endTime)}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteSession(s.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
