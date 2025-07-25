import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const AddTeacherNotePage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStudentName("");

    try {
      const q = query(
        collection(db, "students"),
        where("phone", "==", phoneNumber)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage("❌ لا يوجد تلميذ بهذا الرقم.");
        return;
      }

      const studentDoc = snapshot.docs[0];
      const studentData = studentDoc.data();

      const studentId = studentData.uid;
      if (!studentId) {
        setMessage("⚠️ التلميذ موجود لكن لا يحتوي على uid.");
        return;
      }

      setStudentName(studentData.name || "تلميذ غير مُسمّى");

      await addDoc(collection(db, "teacherNotes"), {
        studentId,
        title,
        content,
        createdAt: Timestamp.now(),
      });

      setMessage("✅ تم حفظ الملاحظة بنجاح.");
      setPhoneNumber("");
      setTitle("");
      setContent("");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="transparent-box">
      <h2 style={{ textAlign: "center" }}>✍️ إضافة ملاحظة لتلميذ</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="📞 رقم هاتف التلميذ"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="🔖 عنوان الملاحظة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="📝 محتوى الملاحظة"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <button type="submit">💾 حفظ الملاحظة</button>
      </form>

      {studentName && <p>🧑‍🎓 تم التعرف على: <strong>{studentName}</strong></p>}
      {message && <p style={{ color: "crimson" }}>{message}</p>}
    </div>
  );
};

export default AddTeacherNotePage;
