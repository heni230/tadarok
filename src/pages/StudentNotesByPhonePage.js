import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const StudentNotesByPhonePage = () => {
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setNotes([]);
    setStudentId(null);

    try {
      const studentQuery = query(collection(db, "students"), where("phone", "==", phone));
      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        setMessage("❌ لا يوجد تلميذ بهذا الرقم.");
        return;
      }

      const studentDoc = studentSnapshot.docs[0];
      const id = studentDoc.id;
      setStudentId(id);

      const notesQuery = query(collection(db, "teacherNotes"), where("studentId", "==", id));
      const notesSnapshot = await getDocs(notesQuery);
      const fetchedNotes = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(fetchedNotes);
      if (fetchedNotes.length === 0) setMessage("📭 لا توجد ملاحظات لهذا التلميذ.");
    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error.message);
      setMessage(`❌ خطأ: ${error.message}`);
    }
  };

  return (
    <div className="transparent-box">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📖 ملاحظات الأستاذ حسب رقم الهاتف</h2>
      <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "auto" }}>
        <input
          type="text"
          placeholder="📞 أدخل رقم هاتفك"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">🔍 عرض الملاحظات</button>
      </form>

      {message && <p style={{ marginTop: "20px", textAlign: "center", color: "#555" }}>{message}</p>}

      {notes.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {notes.map((note) => (
            <li key={note.id} style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
            }}>
              <h4 style={{ marginBottom: "10px", color: "#333" }}>{note.title || "بدون عنوان"}</h4>
              <p style={{ color: "#555" }}>{note.content || "لا يوجد محتوى"}</p>
              {note.createdAt && (
                <p style={{ marginTop: "10px", fontSize: "0.8em", color: "#777" }}>
                  🗓️ التاريخ: {note.createdAt.toDate().toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentNotesByPhonePage;
