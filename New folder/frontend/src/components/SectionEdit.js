import React from "react";

export default function SectionEdit({ sections, setSections }) {
  return (
    <div>
      <h2>Edit Sections</h2>
      {Object.entries(sections).map(([sec, body]) => (
        <div key={sec}>
          <label>{sec.toUpperCase()}</label>
          <textarea
            value={body}
            onChange={(e) =>
              setSections((prev) => ({ ...prev, [sec]: e.target.value }))
            }
          />
        </div>
      ))}
    </div>
  );
}