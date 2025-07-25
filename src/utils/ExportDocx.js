import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  WidthType, TextRun, AlignmentType
} from "docx";
import { saveAs } from "file-saver";

export const exportGroupToDocx = (groupSessions, studentsMap, studentsDetails) => {
  if (!groupSessions?.length) return;

  const baseSession = groupSessions[0];

  const rows = [];

  const headerIcons = [
    "👤 الاسم", "📞 الهاتف", "🏫 المعهد", "🌍 الولاية", "📍 المعتمدية",
    "🧮 الحصة", "📅 التاريخ", "🕒 من", "🕔 إلى", "✍️ التوقيع"
  ];

  // 🔺 صف العناوين
  rows.push(new TableRow({
    children: headerIcons.map(text =>
      new TableCell({
        width: { size: 100 / headerIcons.length, type: WidthType.PERCENTAGE },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, bold: true, size: 24 })] // حجم 12pt
        })]
      })
    )
  }));

  // 🔁 بقية الصفوف
  for (let s of groupSessions) {
    const students = studentsMap[s.id] || [];
    for (let phone of students) {
      const info = studentsDetails[phone];
      const values = [
        info?.name || "", phone, info?.institute || "", info?.state || "",
        info?.delegation || "", s?.title || "", s?.date || "", s?.startTime || "", s?.endTime || "", ""
      ];

      rows.push(new TableRow({
        children: values.map(value =>
          new TableCell({
            width: { size: 100 / headerIcons.length, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: value, size: 22 })] // حجم 11pt
            })]
          })
        )
      }));
    }
  }

  const table = new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }, // عرض 100% من الصفحة
    alignment: AlignmentType.CENTER
  });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `— قائمة الحضور: ${baseSession.title} —`, bold: true, size: 28 })],
          spacing: { after: 300 }
        }),
        table
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `presence_${baseSession.title}_${baseSession.date}.docx`);
  });
};
