import React, { useEffect, useState } from "react";
import {
  collection, getDocs, doc, deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Navigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { exportGroupToExcel } from "../utils/ExportExcel"; // 🔄 دالة التصدير بصيغة Excel

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [studentsDetails, setStudentsDetails] = useState({});
  const teacher = localStorage.getItem("isTeacher");

  useEffect(() => {
    if (teacher) {
      loadSessions();
      loadStudents();
    }
  }, [teacher]);

  const loadSessions = async () => {
    const snap = await getDocs(collection(db, "sessions"));
    const now = new Date();
    const valid = [];

    for (let docSnap of snap.docs) {
      const data = docSnap.data();
      const end = new Date(`${data.date}T${data.endTime}`);
      if (end > now) {
        valid.push({ id: docSnap.id, ...data });
      } else {
        await deleteDoc(doc(db, "sessions", docSnap.id));
      }
    }

    valid.sort((a, b) => {
      const d1 = new Date(`${a.date}T${a.startTime}`);
      const d2 = new Date(`${b.date}T${b.startTime}`);
      return d1 - d2;
    });

    setSessions(valid);
    const map = {};
    valid.forEach((s) => (map[s.id] = s.students || []));
    setStudentsMap(map);
  };

  const loadStudents = async () => {
    const snap = await getDocs(collection(db, "students"));
    const map = {};
    snap.docs.forEach((doc) => {
      const d = doc.data();
      map[d.phone] = d;
    });
    setStudentsDetails(map);
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm("🗑️ هل تريد حذف الحصة؟")) {
      await deleteDoc(doc(db, "sessions", id));
      await loadSessions();
    }
  };

  const handleExportGroupExcel = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const group = sessions.filter(s =>
      s.title === session.title &&
      s.startTime === session.startTime &&
      s.endTime === session.endTime
    );

    exportGroupToExcel(group, studentsMap, studentsDetails, "/assets/logo.png");
  };

  if (!teacher) return <Navigate to="/teacher" />;

  const groupedSessions = {};
  sessions.forEach((s) => {
    const key = `${s.title}-${s.startTime}-${s.endTime}`;
    if (!groupedSessions[key]) groupedSessions[key] = [];
    groupedSessions[key].push(s);
  });

  Object.values(groupedSessions).forEach((group) =>
    group.sort((a, b) => new Date(a.date) - new Date(b.date))
  );

  return (
    <PageWrapper emoji="📅" title="إدارة الحصص">
      <h3>📋 مجموعات الحصص</h3>
      {Object.entries(groupedSessions).map(([key, group]) => (
        <div key={key} style={{
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}>
          <strong>📚 {group[0].title}</strong> – 🕒 {group[0].startTime} → {group[0].endTime}
          <ul>
            {group.map((s) => (
              <li key={s.id} style={{ marginTop: "6px" }}>
                📅 {s.date} – 👥 عدد التلاميذ: {studentsMap[s.id]?.length || 0}
                <button onClick={() => handleExportGroupExcel(s.id)} style={{ marginLeft: "10px" }}>
                  📤 تصدير Excel
                </button>
                <button onClick={() => handleDeleteSession(s.id)} style={{ marginLeft: "10px" }}>
                  🗑️ حذف الحصة
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </PageWrapper>
  );
};

export default SessionManager;
