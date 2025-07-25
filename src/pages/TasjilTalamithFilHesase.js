import React, { useEffect, useState } from "react";
import {
  collection, getDocs, updateDoc, doc
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Navigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const TasjilTalamithFilHesase = () => {
  const teacher = localStorage.getItem("isTeacher");
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [selectedSessionIds, setSelectedSessionIds] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);

  useEffect(() => {
    if (teacher) {
      loadSessions();
      loadStudents();
    }
  }, [teacher]);

  const loadSessions = async () => {
    const snap = await getDocs(collection(db, "sessions"));
    const now = new Date();
    const active = [];

    for (let docSnap of snap.docs) {
      const data = docSnap.data();
      const end = new Date(`${data.date}T${data.endTime}`);
      if (end > now) {
        active.push({ id: docSnap.id, ...data });
      }
    }

    // ✅ ترتيب الحصص حسب التاريخ والتوقيت الحقيقي
    active.sort((a, b) => {
      const d1 = new Date(`${a.date}T${a.startTime}`);
      const d2 = new Date(`${b.date}T${b.startTime}`);
      return d1 - d2;
    });

    setSessions(active);

    // ✅ بناء خريطة التلاميذ حسب الحصة
    const map = {};
    active.forEach((s) => (map[s.id] = s.students || []));
    setStudentsMap(map);
  };

  const loadStudents = async () => {
    const snap = await getDocs(collection(db, "students"));
    const list = snap.docs.map((doc) => doc.data());
    setStudents(list);
  };

  const handleSessionCheckbox = (id) => {
    if (selectedSessionIds.includes(id)) {
      setSelectedSessionIds(selectedSessionIds.filter((s) => s !== id));
    } else {
      setSelectedSessionIds([...selectedSessionIds, id]);
    }
  };

  const handleStudentCheckbox = (phone) => {
    if (selectedPhones.includes(phone)) {
      setSelectedPhones(selectedPhones.filter((p) => p !== phone));
    } else {
      setSelectedPhones([...selectedPhones, phone]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSessionIds.length === 0 || selectedPhones.length === 0) return;

    for (let selectedId of selectedSessionIds) {
      const refSession = sessions.find((s) => s.id === selectedId);
      const sameSeries = sessions.filter((s) =>
        s.title === refSession.title &&
        s.startTime === refSession.startTime &&
        s.endTime === refSession.endTime &&
        new Date(s.date) >= new Date(refSession.date)
      );

      for (let s of sameSeries) {
        const currentList = studentsMap[s.id] || [];
        const updated = Array.from(new Set([...currentList, ...selectedPhones]));
        await updateDoc(doc(db, "sessions", s.id), { students: updated });
      }
    }

    alert("✅ تم تسجيل التلاميذ في جميع الحصص التابعة للسلسلة المحددة");
    setSelectedSessionIds([]);
    setSelectedPhones([]);
    await loadSessions();
  };

  if (!teacher) return <Navigate to="/teacher" />;

  // ✅ الحصة الأولى فقط من كل سلسلة
  const grouped = {};
  sessions.forEach((s) => {
    const key = `${s.title}-${s.startTime}-${s.endTime}`;
    if (!grouped[key] || new Date(s.date) < new Date(grouped[key].date)) {
      grouped[key] = s;
    }
  });

  const filteredSessions = Object.values(grouped).filter((s) => (studentsMap[s.id]?.length || 0) < 18);

  // ✅ التلاميذ غير مسجلين مسبقًا في الحصص المختارة
  const alreadyRegisteredPhones = new Set();
  selectedSessionIds.forEach((id) => {
    const session = sessions.find((s) => s.id === id);
    const sameSeries = sessions.filter((s) =>
      s.title === session.title &&
      s.startTime === session.startTime &&
      s.endTime === session.endTime &&
      new Date(s.date) >= new Date(session.date)
    );
    sameSeries.forEach((s) => {
      (studentsMap[s.id] || []).forEach((p) => alreadyRegisteredPhones.add(p));
    });
  });

  const filteredStudents = students.filter((s) => !alreadyRegisteredPhones.has(s.phone));

  return (
    <PageWrapper emoji="📝" title="تسجيل التلاميذ في الحصص">
      <form onSubmit={handleSubmit}>
        <h3>📅 اختر الحصص (فقط الحصة الأولى من كل سلسلة)</h3>
        <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
          {filteredSessions.map((s) => (
            <label key={s.id} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={selectedSessionIds.includes(s.id)}
                onChange={() => handleSessionCheckbox(s.id)}
              />
              {s.title} – {s.date} ({s.startTime} → {s.endTime}) [👥 {studentsMap[s.id]?.length || 0}]
            </label>
          ))}
          {filteredSessions.length === 0 && <p>📌 لا توجد حصص متاحة للتسجيل</p>}
        </div>

        <h3>👥 اختر التلاميذ</h3>
        <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
          {filteredStudents.map((s) => (
            <label key={s.phone} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={selectedPhones.includes(s.phone)}
                onChange={() => handleStudentCheckbox(s.phone)}
              />
              {s.name} – {s.phone}
            </label>
          ))}
          {filteredStudents.length === 0 && <p>📌 جميع التلاميذ تم تسجيلهم مسبقًا في هذه السلسلة</p>}
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          ✅ تسجيل التلاميذ
        </button>
      </form>
    </PageWrapper>
  );
};

export default TasjilTalamithFilHesase;
