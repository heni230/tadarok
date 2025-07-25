import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const TeacherLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const allowed = {
    Emna: "marwen2024",
    Heni: "admin2024"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (allowed[username] === password) {
      localStorage.setItem("isTeacher", "true");
      localStorage.setItem("teacherUsername", username);
      navigate("/dashboard");
    } else {
      alert("❌ اسم أو كلمة سر غير صحيحة");
    }
  };

  return (
    <PageWrapper emoji="🎓" title="دخول الأستاذ">
      <form onSubmit={handleLogin}>
        <input placeholder="👤 اسم الدخول" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="🔒 كلمة السر" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">🚀 دخول</button>
      </form>
    </PageWrapper>
  );
};

export default TeacherLogin;
