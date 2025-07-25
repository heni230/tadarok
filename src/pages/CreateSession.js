import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Navigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const CreateSession = () => {
  const teacher = localStorage.getItem("isTeacher");
  const [session, setSession] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    repeatWeeks: 1
  });
  const [existingSessions, setExistingSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const snap = await getDocs(collection(db, "sessions"));
      const data = snap.docs.map((doc) => doc.data());
      setExistingSessions(data);
    };
    loadSessions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { title, date, startTime, endTime, repeatWeeks } = session;

    if (!title || !date || !startTime || !endTime || !repeatWeeks) {
      return alert("⚠️ يرجى ملء جميع الخانات");
    }

    const baseDate = new Date(`${date}T${startTime}`);
    const toAdd = [];

    for (let i = 0; i < repeatWeeks; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(currentDate.getDate() + i * 7);

      const formattedDate = currentDate.toISOString().split("T")[0];
      const sessionMonth = currentDate.getMonth(); // جانفي = 0

      const exists = existingSessions.some(
        (s) => s.title === title && s.date === formattedDate && s.startTime === startTime
      );

      if (!exists) {
        toAdd.push({
          title,
          date: formattedDate,
          startTime,
          endTime,
          students: [],
          createdAt: new Date()
        });
      }
    }

    for (let s of toAdd) {
      await addDoc(collection(db, "sessions"), s);
    }

    alert(`✅ تم إنشاء ${toAdd.length} حصة${toAdd.length > 1 ? "ت" : ""} بنجاح`);
    setSession({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      repeatWeeks: 1
    });
  };

  if (!teacher) return <Navigate to="/teacher" />;

  return (
    <PageWrapper emoji="🔧" title="إنشاء حصة جديدة">
      <form onSubmit={handleCreate} style={{ maxWidth: "500px" }}>
        <input
          type="text"
          name="title"
          placeholder="📚 عنوان الحصة"
          value={session.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={session.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="startTime"
          value={session.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={session.endTime}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="repeatWeeks"
          min="1"
          value={session.repeatWeeks}
          onChange={handleChange}
          required
          placeholder="🔁 عدد الأسابيع داخل الشهر"
        />
        <button type="submit" style={{
          marginTop: "10px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          ✅ إنشاء الحصص المتكررة
        </button>
      </form>
    </PageWrapper>
  );
};

export default CreateSession;
