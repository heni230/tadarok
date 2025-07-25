import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import * as XLSX from "xlsx";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const snap = await getDocs(collection(db, "students"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(data);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("🗑️ هل أنت متأكد أنك تريد حذف هذا التلميذ؟")) {
      await deleteDoc(doc(db, "students", id));
      await loadStudents();
      alert("✅ تم حذف التلميذ بنجاح");
    }
  };

  const handleExportExcel = () => {
    const filtered = students.map((s) => ({
      "👤 الاسم": s.name,
      "📞 الهاتف": s.phone,
      "🏫 المعهد": s.institute,
      "🌍 الولاية": s.state,
      "📍 المعتمدية": s.delegation
    }));

    const sheet = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Students");
    XLSX.writeFile(wb, "students-list.xlsx");
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm)
  );

  return (
    <div className="page-wrapper">
      <div className="transparent-box">
        <h2>📄 قائمة التلاميذ المسجلين</h2>

        <input
          type="text"
          placeholder="🔍 بحث بالاسم أو الهاتف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "15px", padding: "8px", width: "300px" }}
        />

        <button
          onClick={handleExportExcel}
          style={{
            marginBottom: "20px",
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          📤 تصدير Excel
        </button>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>👤 الاسم</th>
              <th>📞 الهاتف</th>
              <th>🏫 المعهد</th>
              <th>🌍 الولاية</th>
              <th>📍 المعتمدية</th>
              <th>🧹 حذف</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.institute}</td>
                <td>{s.state}</td>
                <td>{s.delegation}</td>
                <td>
                  <button
                    onClick={() => handleDeleteStudent(s.id)}
                    style={{
                      backgroundColor: "crimson",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    🗑️ حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
