import React, { useState } from "react";

export default function ResumeForm({ onSubmit }) {
  const [rawText, setRawText] = useState("");
  const [template, setTemplate] = useState("modern");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ raw_text: rawText, template_name: template });
      }}
    >
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste resume text or profile info..."
        required
      />
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="modern">Modern</option>
        <option value="classic">Classic</option>
      </select>
      <button type="submit">Build Resume</button>
    </form>
  );
}