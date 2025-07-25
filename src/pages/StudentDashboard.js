import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import { Navigate } from "react-router-dom";

const StudentDashboard = () => {
  const phone = localStorage.getItem("studentPhone");
  const [sessions, setSessions] = useState([]);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      const snap = await getDocs(collection(db, "sessions"));
      const filtered = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) => (s.students || []).includes(phone));
      setSessions(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    const loadStudent = async () => {
      const snap = await getDocs(collection(db, "students"));
      const match = snap.docs.find((doc) => doc.data().phone === phone);
      if (match) setStudentName(match.data().name);
    };

    if (phone) {
      loadSessions();
      loadStudent();
    }
  }, [phone]);

  if (!phone) return <Navigate to="/login" />;

  return (
     <PageWrapper emoji="📚" title={`👋 مرحبًا ${studentName || ""}`}>
    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", textAlign: "center", marginBottom: "20px" }}>
       
      هذه صفحتك الخاصة لمتابعة حصص التدارك—كل ما تحتاجه لتحقيق أفضل النتائج بين يديك.
    </p>

    {sessions.length === 0 ? (
      <p>🕓 لا توجد حصص مسجّلة حاليًا. تابع الجدول القادم للمواعيد الجديدة.</p>
    ) : (
      <ul>
        {sessions.map((s) => (
          <li key={s.id}>
            <strong>📚 {s.title}</strong> – {s.date}
            <br />
            🕒 {s.startTime} → {s.endTime}
          </li>
        ))}
      </ul>
    )}
    </PageWrapper>
  );
};

export default StudentDashboard;
