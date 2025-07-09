import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('teacherUsername') || 'أستاذ';

  return (
    <div className="container">
      <div className="header-brand">📘 Kharoubi Tadarok</div>
      <h2>👨‍🏫 لوحة التحكم</h2>

      <div
        style={{
          backgroundColor: '#e8f5e9',
          border: '2px solid #c8e6c9',
          borderRadius: '12px',
          padding: '28px',
          marginTop: '20px',
        }}
      >
        <h3 style={{ marginBottom: '10px' }}>مرحبًا بك، {teacherName} 👋</h3>
        <p style={{ fontSize: '17px' }}>اختر الإجراء الذي تريد القيام به:</p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '25px',
          }}
        >
          <button
            className="home-button"
            onClick={() => navigate('/register-student')}
          >
            📝 تسجيل تلميذ
          </button>

          <button
            className="home-button"
            onClick={() => navigate('/student-list')}
          >
            👦 قائمة التلاميذ
          </button>

          <button
            className="home-button"
            onClick={() => navigate('/session-manager')}
          >
            🗓️ إدارة الحصص
          </button>

          <button
            className="home-button"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{ backgroundColor: '#bdbdbd' }}
          >
            🔓 تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
