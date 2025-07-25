import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import * as XLSX from "xlsx";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);

  const pageStyle = {
    backgroundImage: "url('../assets/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const overlay = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "40px",
    borderRadius: "10px",
    maxWidth: "800px",
    width: "100%",
    color: "#fff",
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      const data = snapshot.docs.map(doc => doc.data());
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Talabith");
    XLSX.writeFile(workbook, "talabith.xlsx");
  };

  return (
    <div style={pageStyle}>
      <div style={overlay}>
        <h2>📋 قائمة التلاميذ</h2>
        <button onClick={exportToExcel}>📥 تصدير إلى Excel</button>
        <ul style={{ marginTop: "20px", textAlign: "left" }}>
          {students.map((s, i) => (
            <li key={i}>
              {s.name} — {s.phone} — {s.institute} — {s.wilaya} {s.delegation && `(${s.delegation})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
