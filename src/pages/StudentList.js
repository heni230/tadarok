import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import BackToDashboard from '../components/BackToDashboard';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import '../App.css'

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [phoneSummary, setPhoneSummary] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const now = new Date();
    const sessSnap = await getDocs(collection(db, 'sessions'));
    const validSessions = [];

    for (let docu of sessSnap.docs) {
      const data = docu.data();
      const endTime = data.endTime?.seconds ? new Date(data.endTime.seconds * 1000) : null;
      if (endTime && endTime > now) {
        validSessions.push({ id: docu.id, ...data });
      } else {
        await deleteDoc(doc(db, 'sessions', docu.id));
      }
    }

    setSessions(validSessions);

    const studSnap = await getDocs(collection(db, 'students'));
    const validStudents = [];
    const phoneCount = {};

    for (let docu of studSnap.docs) {
      const data = docu.data();
      const sess = validSessions.find(s => s.id === data.sessionId);
      if (sess && sess.endTime?.seconds) {
        const date = new Date(sess.startTime.seconds * 1000);
        validStudents.push({
          id: docu.id,
          ...data,
          sessionName: sess.name,
          sessionDate: date.toLocaleDateString('fr-TN'),
          sessionTime: date.toLocaleTimeString('ar-TN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        });
        phoneCount[data.phone] = (phoneCount[data.phone] || 0) + 1;
      } else {
        await deleteDoc(doc(db, 'students', docu.id));
      }
    }

    setStudents(validStudents);
    setPhoneSummary(phoneCount);
  };

  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, 'students', id));
    fetchAll();
  };

  const exportExcel = async () => {
    const filtered = students.filter(
      s => selectedSession === '' || s.sessionId === selectedSession
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('قائمة التلاميذ', { views: [{ RTL: true }] });

    sheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'الاسم الكامل', key: 'name', width: 25 },
      { header: 'رقم الهاتف', key: 'phone', width: 20 },
      { header: 'اسم الحصة', key: 'session', width: 20 },
      { header: 'تاريخ الحصة', key: 'date', width: 15 },
      { header: 'توقيت الحصة', key: 'time', width: 15 }
    ];

    filtered.forEach((s, i) => {
      sheet.addRow({
        index: i + 1,
        name: s.name,
        phone: s.phone,
        session: s.sessionName,
        date: s.sessionDate,
        time: s.sessionTime
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF43a047' } };
    sheet.getRow(1).alignment = { horizontal: 'center' };
    sheet.columns.forEach(col => (col.alignment = { horizontal: 'center' }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'قائمة_التلاميذ.xlsx');
  };

  return (
    <div className="container">
      <BackToDashboard />

      <h2>📋 قائمة التلاميذ ({students.length})</h2>

      <select
        value={selectedSession}
        onChange={e => setSelectedSession(e.target.value)}
        style={{ marginBottom: '15px' }}
      >
        <option value="">🗂️ كل الحصص</option>
        {sessions.map(sess => (
          <option key={sess.id} value={sess.id}>
            {sess.name} – {sess.startTime?.seconds ? new Date(sess.startTime.seconds * 1000).toLocaleDateString() : ''}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>الحصة</th>
            <th>تاريخ</th>
            <th>توقيت</th>
            <th>🗑️</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter(s => selectedSession === '' || s.sessionId === selectedSession)
            .map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.sessionName}</td>
                <td>{s.sessionDate}</td>
                <td>{s.sessionTime}</td>
                <td>
                  <button onClick={() => deleteStudent(s.id)} className="delete-btn">❌</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={exportExcel}>🟩 تحميل Excel</button>

      <h4 style={{ marginTop: '30px' }}>📊 عدد الحصص حسب رقم الهاتف</h4>
      <ul>
        {Object.entries(phoneSummary).map(([phone, count]) => (
          <li key={phone}>📞 {phone}: 🧾 {count} حصة</li>
        ))}
      </ul>
    </div>
  );
}
