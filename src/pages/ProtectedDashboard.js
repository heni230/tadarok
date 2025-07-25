import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import PageWrapper from "../components/PageWrapper";
import { Navigate } from "react-router-dom";

const ProtectedDashboard = () => {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const teacher = localStorage.getItem("isTeacher");

  useEffect(() => {
    const loadData = async () => {
      const studentsSnap = await getDocs(collection(db, "students"));
      const sessionsSnap = await getDocs(collection(db, "sessions"));

      setStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSessions(sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (teacher) loadData();
  }, [teacher]);

  if (!teacher) return <Navigate to="/teacher" />;

  return (
    <PageWrapper emoji="📋" title="لوحة الأستاذ">
      <h3>👨‍🎓 التلاميذ</h3>
      <ul>
        {students.map(s => <li key={s.id}>{s.name} – {s.phone}</li>)}
      </ul>
      <h3 style={{ marginTop: "30px" }}>📅 الحصص</h3>
      <ul>
        {sessions.map(s => (
          <li key={s.id}>
            {s.title} – {s.date} ({s.startTime} → {s.endTime})  
            <br /> التلاميذ: {s.students?.join(", ")}
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
};

export default ProtectedDashboard;
