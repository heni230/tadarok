import * as XLSX from "xlsx";

const ExcelExporter = ({ students }) => {
  const exportToExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(students);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Talabith");
    XLSX.writeFile(book, "talabith.xlsx");
  };

  return <button onClick={exportToExcel}>📥 تصدير Excel</button>;
};

export default ExcelExporter;
