import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navbarStyle}>
      {/* ✅ الجهة اليمنى: الروابط */}
      <div style={right}>
        <Link to="/" style={getStyle(isActive('/'))}>الرئيسية</Link>
        <Link to="/student-register" style={getStyle(isActive('/student-register'))}>تسجيل</Link>
        <Link to="/student-login" style={getStyle(isActive('/student-login'))}>دخول التلميذ</Link>
        <Link to="/login" style={getStyle(isActive('/login'))}>دخول الأستاذ</Link>
      </div>

      {/* ✅ الجهة اليسرى: اسم المنصة */}
      <div style={left}>
        <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#0d47a1' }}>
          🎓 منصة Kharoubi Tadarok
        </span>
      </div>
    </nav>
  );
}

// تنسيقات CSS داخلية
const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(4px)',
  padding: '12px 20px',
  borderBottom: '1px solid #ccc',
  direction: 'rtl'
};

const right = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const left = {
  display: 'flex',
  alignItems: 'center'
};

const getStyle = (active) => ({
  fontWeight: 'bold',
  color: active ? '#0d47a1' : '#333',
  backgroundColor: active ? '#bbdefb' : 'transparent',
  padding: '8px 12px',
  borderRadius: '6px',
  textDecoration: 'none'
});

export default Navbar;
