import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import '../App.css';

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [phone, setPhone] = useState(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const storedPhone = localStorage.getItem('studentPhone');
    const storedName = localStorage.getItem('studentName');

    if (!storedPhone) {
      window.location.href = '/student-login';
    } else {
      setPhone(storedPhone);
      setStudentName(storedName || 'تلميذنا العزيز');
      fetchStudentSessions(storedPhone);
    }
  }, []);

  const fetchStudentSessions = async (studentPhone) => {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const studentDocs = studentsSnap.docs.filter(doc => doc.data().phone === studentPhone);
    const sessionIds = studentDocs.map(doc => doc.data().sessionId);

    const sessionsSnap = await getDocs(collection(db, 'sessions'));
    const allSessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const mySessions = allSessions
      .filter(sess => sessionIds.includes(sess.id))
      .map(sess => ({
        id: sess.id,
        name: sess.name,
        start: new Date(sess.startTime?.seconds * 1000),
        end: new Date(sess.endTime?.seconds * 1000)
      }));

    setSessions(mySessions.sort((a, b) => a.start - b.start));
  };

  const handleRegisterAll = async () => {
    try {
      const studentPhone = localStorage.getItem('studentPhone');
      const studentName = localStorage.getItem('studentName') || 'تلميذ';

      if (!studentPhone) return;

      const studentsSnap = await getDocs(collection(db, 'students'));
      const registeredIds = studentsSnap.docs
        .filter(doc => doc.data().phone === studentPhone)
        .map(doc => doc.data().sessionId);

      const now = new Date();
      const upcoming = sessions.filter(
        s => s.start > now && !registeredIds.includes(s.id)
      );

      for (let s of upcoming) {
        await addDoc(collection(db, 'students'), {
          phone: studentPhone,
          name: studentName,
          password: 'dummy',
          sessionId: s.id
        });
      }

      alert(`✔️ تم تسجيلك في ${upcoming.length} من الحصص المستقبلية`);
      fetchStudentSessions(studentPhone);
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ أثناء محاولة التسجيل');
    }
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString('ar-TN', {
      hour: '2-digit',
      minute: '2-digit'
    }) || '';

  const formatDate = (date) =>
    date?.toLocaleDateString('ar-TN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) || '';

  const handleLogout = () => {
    localStorage.removeItem('studentPhone');
    localStorage.removeItem('studentName');
    window.location.href = '/student-login';
  };

  return (
    <div className="container">
      <div className="header-brand">🎓 Kharoubi Tadarok</div>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3>👋 مرحبًا بك يا <span style={{ color: '#1976d2' }}>{studentName}</span>!</h3>
        <p>نرجو لك متابعة ممتعة ومثمرة في حصصك 🌟</p>
      </div>

      {sessions.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleRegisterAll}
            style={{
              backgroundColor: '#00796b',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              marginBottom: '25px',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#004d40'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00796b'}
          >
            ✅ تسجيل في جميع الحصص لهذا الشهر
          </button>
        </div>
      )}

      <h2>📘 حصصك المسجّل فيها</h2>

      {sessions.length === 0 ? (
        <p style={{ color: 'gray' }}>❗ لا توجد حصص مسجّل بها حتى الآن</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {sessions.map(s => (
            <li key={s.id} className="session-time-box">
              <strong>{s.name}</strong><br />
              📅 {formatDate(s.start)}<br />
              🕒 {formatTime(s.start)} → {formatTime(s.end)}
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleLogout} style={{ marginTop: '30px' }}>
        🚪 تسجيل الخروج
      </button>
    </div>
  );
}
