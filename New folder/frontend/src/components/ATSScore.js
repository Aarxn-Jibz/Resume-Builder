import React from "react";
export default function ATSScore({ score, feedback }) {
  return (
    <div>
      <h3>ATS Score: {score}</h3>
      {feedback.map((f, i) => (
        <div key={i} style={{ color: "red" }}>{f}</div>
      ))}
    </div>
  );
}