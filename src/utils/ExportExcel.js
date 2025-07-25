import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportGroupToExcel = async (
  groupSessions,
  studentsMap,
  studentsDetails,
  logoURL // مثال: "/assets/logo.png"
) => {
  if (!groupSessions?.length) return;

  const baseSession = groupSessions[0];
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Presence", {
    properties: { defaultColWidth: 20 },
    pageSetup: {
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      orientation: "landscape",
      paperSize: 9 // A4
    }
  });

  // 🖼️ إدراج الشعار إذا توفر
  if (logoURL) {
    try {
      const response = await fetch(logoURL);
      const buffer = await response.arrayBuffer();
      const base64Logo = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const imageId = workbook.addImage({
        extension: "png",
        base64: base64Logo
      });

      sheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 120, height: 50 }
      });

      sheet.addRow([]);
      sheet.addRow([]);
    } catch (error) {
      console.warn("⚠️ فشل تحميل الصورة:", error);
    }
  }

  // 🏷️ رأس الجدول
  const headers = [
    "👤 الاسم", "📞 الهاتف", "🏫 المعهد", "🌍 الولاية", "📍 المعتمدية",
    "🧮 الحصة", "📅 التاريخ", "🕒 من", "🕔 إلى", "✍️ التوقيع"
  ];
  sheet.addRow(headers);

  // 🧑‍🎓 الصفوف
  for (let s of groupSessions) {
    const students = studentsMap[s.id] || [];
    for (let phone of students) {
      const info = studentsDetails[phone];
      sheet.addRow([
        info?.name || "", phone,
        info?.institute || "", info?.state || "", info?.delegation || "",
        s?.title || "", s?.date || "", s?.startTime || "", s?.endTime || "", ""
      ]);
    }
  }

  // 🎯 تنسيق الأعمدة وضبط العرض
  sheet.columns.forEach((col, index) => {
    col.width = 22;
    col.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true
    };
  });

  // 📤 حفظ الملف
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `presence_${baseSession.title}_${baseSession.date}.xlsx`);
};
