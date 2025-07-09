import React from 'react';
import '../App.css';

export default function LandingScreen() {
  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'  // نحافظ على التوسيط العمودي
    }}>
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '50vh'
      }}>
        <div>
          <h2 style={{ marginBottom: '20px' }}>👋 مرحبًا بك في منصتنا التعليمية</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', maxWidth: '600px' }}>
            ✨ تهدف منصتنا إلى تقديم بيئة تعليمية مرحة وفعّالة للتلاميذ والأساتذة.  
            استخدم الأزرار العلوية للتسجيل أو الدخول حسب دورك.  
            نحن سعداء بانضمامك إلينا ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
