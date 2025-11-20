import React from "react";
import api from "../api";
export default function ExportButton({ sections }) {
  const handleExport = async (filetype) => {
    await api.exportResume(sections, filetype); // Implement download logic
  };
  return (
    <div>
      <button onClick={() => handleExport("pdf")}>Export as PDF</button>
      <button onClick={() => handleExport("docx")}>Export as DOCX</button>
      <button onClick={() => handleExport("txt")}>Export as TXT</button>
    </div>
  );
}