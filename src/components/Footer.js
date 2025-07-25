import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
      <p>
        <span>تم التصميم والتنفيذ بواسطة </span>
        <strong>Heni Haggui</strong> 💻🌟
      </p>
    </footer>
  );
}