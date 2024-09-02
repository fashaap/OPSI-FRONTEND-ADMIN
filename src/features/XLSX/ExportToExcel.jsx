import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = (data, name) => {
  const today = new Date();
  today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `${name} ${date}-${month}-${year}.xlsx`);
  };

  return exportToExcel();
};

export default ExportToExcel;
