import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig"; // تأكد من مسار الاستيراد حسب مشروعك
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      setMessage("❌ لا يوجد مستخدم مسجل الدخول.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential); // التحقق بكلمة المرور القديمة

      await updatePassword(user, newPassword); // تحديث كلمة المرور
      setMessage("✅ تم تغيير كلمة المرور بنجاح.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(`❗ خطأ: ${error.message}`);
    }
  };

  return (
    <div className="transparent-box">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🔐 تغيير كلمة المرور</h2>
      <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="password"
          placeholder="كلمة المرور الحالية"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">تأكيد التغيير</button>
      </form>
      {message && <p style={{ marginTop: "15px", color: "#f00", textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default ChangePasswordPage;
