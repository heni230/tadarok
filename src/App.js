import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🧩 الصفحات
import HomePage from "./pages/HomePage";
import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import ProtectedDashboard from "./pages/ProtectedDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SessionManager from "./pages/SessionManager";
import CreateSession from "./pages/CreateSession";
import StudentList from "./pages/StudentList";
import TasjilTalamithFilHesase from "./pages/TasjilTalamithFilHesase";
import ChangePasswordPage from "./pages/ChangePasswordPage"; // ✅ تم إضافته
import TeacherNotesPage from './pages/TeacherNotesPage';
import AddTeacherNotePage from "./pages/AddTeacherNotePage";
import StudentNotesByPhonePage from "./pages/StudentNotesByPhonePage";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Navbar />
        <Routes>
          {/* 🏠 الصفحة الرئيسية */}
          <Route path="/home" element={<HomePage />} />

          {/* 📝 تسجيل التلميذ */}
          <Route path="/" element={<StudentRegister />} />

          {/* 🔐 دخول التلميذ */}
          <Route path="/login" element={<StudentLogin />} />

          {/* 👨‍🎓 صفحة التلميذ */}
          <Route path="/student" element={<StudentDashboard />} />

          {/* 🔐 تغيير كلمة المرور */}
          <Route path="/change-password" element={<ChangePasswordPage />} /> {/* ✅ المسار الجديد */}
          
          <Route path="/notes" element={<TeacherNotesPage />} />

          {/* 🎓 دخول الأستاذ */}
          <Route path="/teacher" element={<TeacherLogin />} />

          {/* 📋 لوحة الأستاذ */}
          <Route path="/dashboard" element={<ProtectedDashboard />} />

          {/* 📅 إدارة الحصص */}
          <Route path="/sessions" element={<SessionManager />} />

          {/* 🔧 إنشاء الحصة */}
          <Route path="/create-session" element={<CreateSession />} />

          {/* 📄 قائمة التلاميذ */}
          <Route path="/students-list" element={<StudentList />} />
          
          <Route path="/add-note" element={<AddTeacherNotePage />} />
          
          {/* 📝 تسجيل جماعي للتلاميذ في الحصة */}
          <Route path="/tasjil-talamith" element={<TasjilTalamithFilHesase />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
