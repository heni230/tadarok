import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackToDashboard() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/teacher-dashboard')}
      className="home-button"
      style={{
        marginBottom: '15px',
        backgroundColor: '#aed581',
        alignSelf: 'flex-start',
      }}
    >
      🏠 العودة إلى لوحة التحكم
    </button>
  );
}
