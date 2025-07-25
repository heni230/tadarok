import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";

const StudentRegister = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    institute: "",
    state: "صفاقس",
    delegation: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const wilayas = [
    "صفاقس", "تونس", "أريانة", "بنزرت", "نابل", "زغوان", "المنستير", "المهدية",
    "سوسة", "القيروان", "سيدي بوزيد", "القصرين", "قفصة", "توزر", "قبلي",
    "مدنين", "تطاوين", "بن عروس", "جندوبة", "الكاف", "سليانة", "باجة", "منوبة", "قابس"
  ];

  const delegationsSfax = [
    "صفاقس المدينة", "صفاقس الغربية", "صفاقس الجنوبية", "قرقنة",
    "عين بورقبة", "الحسّونة", "طينة", "العين", "جبنيانة", "المحرس"
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, phone, password, institute, state, delegation } = form;

    if (!name || !phone || !password || !institute || !state || (state === "صفاقس" && !delegation)) {
      setError("⚠️ جميع الخانات مطلوبة");
      return;
    }

    if (!/^\d{8}$/.test(phone)) {
      setError("📞 رقم الهاتف يجب أن يكون 8 أرقام");
      return;
    }

    const snapshot = await getDocs(collection(db, "students"));
    const existing = snapshot.docs.find((doc) => doc.data().phone === phone);
    if (existing) {
      setError("🚫 رقم الهاتف هذا مسجّل مسبقًا");
      return;
    }

    await addDoc(collection(db, "students"), {
      name,
      phone,
      password,
      institute,
      state,
      delegation: state === "صفاقس" ? delegation : null
    });

    setSuccess("✅ تم تسجيل التلميذ بنجاح");
    setForm({
      name: "",
      phone: "",
      password: "",
      institute: "",
      state: "صفاقس",
      delegation: ""
    });
  };

  return (
    <PageWrapper emoji="📝" title="تسجيل تلميذ جديد">
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="👤 اسم التلميذ"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="📞 رقم الهاتف (8 أرقام)"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="🔐 كلمة السر"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="institute"
          placeholder="🏫 اسم المعهد"
          value={form.institute}
          onChange={handleChange}
        />

        <select name="state" value={form.state} onChange={handleChange}>
          {wilayas.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        {form.state === "صفاقس" && (
          <select
            name="delegation"
            value={form.delegation}
            onChange={handleChange}
          >
            <option value="">اختر المعتمدية</option>
            {delegationsSfax.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        )}

        <button type="submit">🚀 تسجيل</button>
        {error && <p style={{ color: "yellow", marginTop: "10px" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen", marginTop: "10px" }}>{success}</p>}
      </form>
    </PageWrapper>
  );
};

export default StudentRegister;
