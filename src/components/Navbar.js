import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const teacherStatus = localStorage.getItem("isTeacher") === "true";
    const studentStatus = !!localStorage.getItem("studentPhone");
    setIsTeacher(teacherStatus);
    setIsStudent(studentStatus);
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleStudentLogout = () => {
    localStorage.removeItem("studentPhone");
    navigate("/home");
  };

  const handleTeacherLogout = () => {
    localStorage.removeItem("isTeacher");
    localStorage.removeItem("teacherUsername");
    navigate("/home");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {/* روابط عامة بالأيقونات فقط */}
        {!isStudent && !isTeacher && (
          <>
            <Link to="/">
              <img src="/icons/register.png" alt="تسجيل" className="nav-icon" title="تسجيل التلميذ" />
            </Link>
            <Link to="/login">
              <img src="/icons/student.png" alt="دخول تلميذ" className="nav-icon" title="دخول التلميذ" />
            </Link>
            <Link to="/teacher">
              <img src="/icons/teacher.png" alt="دخول الأستاذ" className="nav-icon" title="دخول الأستاذ" />
            </Link>
            <Link to="/home">
              <img src="/icons/home.png" alt="الرئيسية" className="nav-icon" title="الصفحة الرئيسية" />
            </Link>
          </>
        )}

        {/* روابط التلميذ */}
{isStudent && (
  <>
    <Link to="/student">
      <img src="/icons/book.png" alt="حصصك" className="nav-icon" title="حصصك" />
    </Link>

    <Link to="/notes">
      <img src="/icons/notes.png" alt="ملاحظات الأستاذ" className="nav-icon" title="ملاحظات الأستاذ" />
    </Link>

    <Link to="/change-password">
      <img src="/icons/password.png" alt="تغيير كلمة المرور" className="nav-icon" title="تغيير كلمة المرور" />
    </Link>

    <button className="logout-btn" onClick={handleStudentLogout}>
      <img src="/icons/logout.png" alt="خروج" className="nav-icon" title="خروج التلميذ" />
    </button>
  </>
)}


        {/* روابط الأستاذ */}
        {isTeacher && (
          <>
            <Link to="/dashboard">
              <img src="/icons/dashboard.png" alt="لوحة الأستاذ" className="nav-icon" title="لوحة الأستاذ" />
            </Link>
            <Link to="/tasjil-talamith">
              <img src="/icons/group-register.png" alt="تسجيل التلاميذ" className="nav-icon" title="تسجيل التلاميذ في الحصة" />
            </Link>
            <Link to="/sessions">
              <img src="/icons/calendar.png" alt="الحصص" className="nav-icon" title="إدارة الحصص" />
            </Link>
            <Link to="/create-session">
              <img src="/icons/add.png" alt="إنشاء حصة" className="nav-icon" title="إنشاء حصة" />
            </Link>
            <Link to="/students-list">
              <img src="/icons/list.png" alt="قائمة التلاميذ" className="nav-icon" title="قائمة التلاميذ" />
            </Link>
            <Link to="/add-note">
              <img src="/icons/add-note.png" alt="إضافة ملاحظة" className="nav-icon" title="إضافة ملاحظة" />
            </Link>
            <button className="logout-btn" onClick={handleTeacherLogout}>
              <img src="/icons/logout.png" alt="خروج" className="nav-icon" title="خروج الأستاذ" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
