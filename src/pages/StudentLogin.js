import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const StudentLogin = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { phone, password } = form;

    if (!/^\d{8}$/.test(phone) || !password) {
      setError("⚠️ رقم الهاتف يجب أن يكون 8 أرقام وكلمة السر مطلوبة");
      return;
    }

    try {
      const snap = await getDocs(collection(db, "students"));
      const student = snap.docs.find(
        (doc) =>
          doc.data().phone === phone &&
          doc.data().password === password
      );

      if (!student) {
        setError("🚫 البيانات غير صحيحة، الرجاء التثبت");
        return;
      }

      localStorage.setItem("studentPhone", phone);
      localStorage.setItem("studentName", student.data().name); // ✅ السطر المضاف لعرض الاسم في Navbar

      navigate("/student");
    } catch (err) {
      console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err);
      setError("❌ خطأ تقني... حاول من جديد لاحقًا");
    }
  };

  return (
    <PageWrapper emoji="🔐" title="دخول التلميذ">
      <form onSubmit={handleSubmit}>
        <input
          name="phone"
          placeholder="📞 رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="🔒 كلمة السر"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">🚀 دخول</button>
        {error && <p style={{ color: "yellow", marginTop: "10px" }}>{error}</p>}
      </form>
    </PageWrapper>
  );
};

export default StudentLogin;
