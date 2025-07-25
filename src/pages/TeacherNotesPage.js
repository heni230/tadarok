import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const TeacherNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const notesQuery = query(
        collection(db, "teacherNotes"),
        where("studentId", "==", user.uid)
      );

      const unsubscribeSnapshot = onSnapshot(notesQuery, (snapshot) => {
        const fetchedNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(fetchedNotes);
        setLoading(false);
      });

      // تنظيف عند التفكيك
      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="transparent-box">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📘 ملاحظاتك الشخصية</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>🕒 جاري تحميل الملاحظات...</p>
      ) : notes.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h4 style={{ marginBottom: "10px", color: "#333" }}>
                {note.title || "بدون عنوان"}
              </h4>
              <p style={{ marginBottom: "5px", color: "#555" }}>
                {note.content || "لا يوجد محتوى"}
              </p>
              {note.createdAt && note.createdAt.toDate && (
                <p style={{ fontSize: "0.8em", color: "#777" }}>
                  🗓️ التاريخ: {note.createdAt.toDate().toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: "center", color: "#555" }}>
          📭 لا توجد ملاحظات مسجلة لك حتى الآن.
        </p>
      )}
    </div>
  );
};

export default TeacherNotesPage;
