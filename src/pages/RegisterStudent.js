import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import '../App.css';

export default function RegisterStudent() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [registerAll, setRegisterAll] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const snapshot = await getDocs(collection(db, 'sessions'));
    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name,
        startTime: d.startTime?.seconds ? new Date(d.startTime.seconds * 1000) : null,
        endTime: d.endTime?.seconds ? new Date(d.endTime.seconds * 1000) : null
      };
    });
    setSessions(data.sort((a, b) => a.startTime - b.startTime));
  };

  const handleSessionSelect = (id) => {
    setSelectedSession(id);
    const found = sessions.find(s => s.id === id);
    setSessionDetails(found || null);
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatSessionDisplay = (s) => {
    const date = formatDate(s.startTime);
    const start = formatTime(s.startTime);
    const end = formatTime(s.endTime);
    return `${s.name}   ${date}   ${start}   ${end}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !password || !selectedSession) {
      alert('❌ يرجى تعبئة جميع الحقول');
      return;
    }

    if (!/^\d{8}$/.test(phone)) {
      alert('❌ رقم الهاتف يجب أن يحتوي على 8 أرقام فقط');
      return;
    }

    const studentRef = collection(db, 'students');
    const snapshot = await getDocs(studentRef);
    const mainSession = sessions.find(s => s.id === selectedSession);
    if (!mainSession) return alert('❌ الحصة غير موجودة');

    if (registerAll) {
      const allSameMonth = sessions.filter(s =>
        s.name === mainSession.name &&
        s.startTime?.getMonth() === mainSession.startTime?.getMonth() &&
        s.startTime?.getFullYear() === mainSession.startTime?.getFullYear()
      );

      let registeredCount = 0;

      for (let s of allSameMonth) {
        const inSession = snapshot.docs.filter(d => d.data().sessionId === s.id);
        const alreadyRegistered = inSession.find(d => d.data().phone === phone);

        if (!alreadyRegistered && inSession.length < 18) {
          await addDoc(studentRef, { name, phone, password, sessionId: s.id });
          registeredCount++;
        }
      }

      alert(`✅ تم تسجيل التلميذ في ${registeredCount} من الحصص الشهرية`);
    } else {
      const inSameSession = snapshot.docs.filter(d => d.data().sessionId === selectedSession);
      if (inSameSession.length >= 18) {
        alert('❌ هذه الحصة ممتلئة (18 تلميذ كحد أقصى)');
        return;
      }

      const duplicate = inSameSession.find(d => d.data().phone === phone);
      if (duplicate) {
        alert('⚠️ هذا الرقم مسجل مسبقًا في هذه الحصة');
        return;
      }

      await addDoc(studentRef, { name, phone, password, sessionId: selectedSession });
      alert('✅ تم تسجيل التلميذ في الحصة المحددة');
    }

    setName('');
    setPhone('');
    setPassword('');
    setSelectedSession('');
    setSessionDetails(null);
    setRegisterAll(false);
  };

  return (
    <div className="container">
      <div className="header-brand">Kharoubi Tadarok</div>
      <h2>📝 تسجيل التلميذ</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="👤 الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="📞 رقم الهاتف (8 أرقام)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          maxLength={8}
          required
        />

        <input
          type="password"
          placeholder="🔑 كلمة السر (يختارها التلميذ)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>📂 اختر الحصة</label>
        <select value={selectedSession} onChange={(e) => handleSessionSelect(e.target.value)} required>
          <option value="">— اختر من القائمة —</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>{formatSessionDisplay(s)}</option>
          ))}
        </select>

        {sessionDetails && (
          <div className="session-time-box">
            📘 التوقيت: {formatTime(sessionDetails.startTime)} → {formatTime(sessionDetails.endTime)}
          </div>
        )}

        <label>
          <input
            type="checkbox"
            checked={registerAll}
            onChange={() => setRegisterAll(!registerAll)}
          />
          🔁 سجلني في جميع حصص هذا الشهر
        </label>

        <button type="submit">✔️ تسجيل</button>
      </form>
    </div>
  );
}
