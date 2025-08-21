import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports({ expenses }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.toISOString().split("T")[0];

    return (
      (!selectedYear || selectedYear === year) &&
      (!selectedMonth || selectedMonth === month) &&
      (!selectedDate || selectedDate === day)
    );
  });

  const total = filteredExpenses.reduce(
    (acc, exp) => acc + Number(exp.amount),
    0
  );

  const downloadReport = () => {
    if (downloadFormat === "pdf") {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Expense Report", 14, 15);

      let filterText = "Filters: ";
      if (selectedYear) filterText += `Year: ${selectedYear} `;
      if (selectedMonth)
        filterText += `Month: ${new Date(0, selectedMonth - 1).toLocaleString(
          "default",
          { month: "long" }
        )} `;
      if (selectedDate) filterText += `Date: ${selectedDate}`;
      if (!selectedYear && !selectedMonth && !selectedDate)
        filterText += "All Records";

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(filterText, 14, 25);

      const tableData = filteredExpenses.map((exp) => {
        const dateObj = new Date(exp.date);
        return [
          exp.title,
          Number(exp.amount).toLocaleString("en-IN"),
          dateObj.getDate(),
          dateObj.toLocaleString("default", { month: "long" }),
          dateObj.getFullYear(),
          dateObj.toLocaleTimeString(),
        ];
      });

      autoTable(doc, {
        startY: 35,
        head: [["Title", "Amount", "Day", "Month", "Year", "Time"]],
        body: tableData.length
          ? tableData
          : [["No expenses found", "-", "-", "-", "-", "-"]],
        styles: { font: "helvetica", fontSize: 11 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(
        `Total: ${total.toLocaleString("en-IN")}`,
        14,
        doc.lastAutoTable.finalY + 15
      );

      const pageHeight = doc.internal.pageSize.height;
      const date = new Date().toLocaleString();
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(
        `Generated on ${date} | By Aditya Kumar Singh`,
        14,
        pageHeight - 10
      );

      doc.save("Expense_Report.pdf");
    } 
    else if (downloadFormat === "csv") {
      const header = ["Title", "Amount (₹)", "Day", "Month", "Year", "Time"];
      const rows = filteredExpenses.map((exp) => {
        const dateObj = new Date(exp.date);
        return [
          `"${exp.title}"`,
          `"${Number(exp.amount).toLocaleString("en-IN")}"`,
          `"${dateObj.getDate()}"`,
          `"${dateObj.toLocaleString("default", { month: "long" })}"`,
          `"${dateObj.getFullYear()}"`,
          `"${dateObj.toLocaleTimeString()}"`,
        ];
      });

      let csvContent =
        "\uFEFF" + [header, ...rows].map((e) => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Expense_Report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    else if (downloadFormat === "txt") {
      let txtContent = "Expense Report\n\n";
      txtContent += "Title | Amount | Day | Month | Year | Time\n";
      txtContent += "---------------------------------------------------------\n";

      filteredExpenses.forEach((exp) => {
        const dateObj = new Date(exp.date);
        txtContent += `${exp.title} | ${Number(exp.amount).toLocaleString(
          "en-IN"
        )} ₹ | ${dateObj.getDate()} | ${dateObj.toLocaleString("default", {
          month: "long",
        })} | ${dateObj.getFullYear()} | ${dateObj.toLocaleTimeString()}\n`;
      });

      txtContent += `\nTotal: ${total.toLocaleString("en-IN")} ₹`;

      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Expense_Report.txt");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="card-glass animate__animated animate__fadeInUp">
      <h4>📑 Reports</h4>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="number"
          placeholder="Enter Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="form-control"
          style={{ maxWidth: "150px" }}
        />

        <select
          className="form-control"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ maxWidth: "150px" }}
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ maxWidth: "180px" }}
        />
      </div>

      <table className="summary-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount (₹)</th>
            <th>Day</th>
            <th>Month</th>
            <th>Year</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length ? (
            filteredExpenses.map((exp, idx) => {
              const dateObj = new Date(exp.date);
              return (
                <tr key={idx}>
                  <td>{exp.title}</td>
                  <td>{Number(exp.amount).toLocaleString("en-IN")} ₹</td>
                  <td>{dateObj.getDate()}</td>
                  <td>{dateObj.toLocaleString("default", { month: "long" })}</td>
                  <td>{dateObj.getFullYear()}</td>
                  <td>{dateObj.toLocaleTimeString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No expenses found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="total-box mt-3">
        Total: {total.toLocaleString("en-IN")} ₹
      </div>

      <div className="d-flex gap-2 mt-3">
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={downloadFormat}
          onChange={(e) => setDownloadFormat(e.target.value)}
        >
          <option value="pdf">📄 PDF</option>
          <option value="csv">📊 CSV</option>
          <option value="txt">📜 TXT</option>
        </select>

        <button className="btn btn-primary" onClick={downloadReport}>
          📥 Download
        </button>
      </div>
    </div>
  );
}
