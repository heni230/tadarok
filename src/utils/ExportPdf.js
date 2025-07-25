// src/utils/ExportPdf.js

import jsPDF from "jspdf";
import "jspdf-autotable";

// دالة تصدير PDF منظمة، فيها خانة التوقيع فقط
export const exportGroupToPdf = (groupSessions, studentsMap, studentsDetails) => {
  if (!groupSessions?.length) return;

  const baseSession = groupSessions[0];
  const rows = [];

  for (let s of groupSessions) {
    const students = studentsMap[s.id] || [];
    for (let phone of students) {
      const info = studentsDetails[phone];
      rows.push([
        info?.name || "",
        phone,
        info?.institute || "",
        info?.state || "",
        info?.delegation || "",
        s?.title || "",
        s?.date || "",
        s?.startTime || "",
        s?.endTime || "",
        "" // ✍️ التوقيع اليدوي
      ]);
    }
  }

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(12);
  doc.text(`📋 قائمة الحضور – ${baseSession.title}`, 14, 15);

  doc.autoTable({
    startY: 20,
    head: [[
      "👤 الاسم",
      "📞 الهاتف",
      "🏫 المعهد",
      "🌍 الولاية",
      "📍 المعتمدية",
      "🧮 الحصة",
      "📅 التاريخ",
      "🕒 من",
      "🕔 إلى",
      "✍️ التوقيع"
    ]],
    body: rows,
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      halign: "center"
    }
  });

  doc.save(`presence_${baseSession.title}_${baseSession.date}.pdf`);
};
