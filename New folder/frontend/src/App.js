import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import SectionEdit from "./components/SectionEdit";
import TemplatePicker from "./components/TemplatePicker";
import ATSScore from "./components/ATSScore";
import ExportButton from "./components/ExportButton";
import api from "./api";

function App() {
  const [sections, setSections] = useState({});
  const [atsScore, setAtsScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  const handleBuildResume = async (inputData) => {
    const result = await api.buildResume(inputData);
    setSections(result.sections);
    setAtsScore(result.atsScore);
    setFeedback(result.feedback);
  };

  return (
    <div>
      <h1>Resume Builder Crew</h1>
      <ResumeForm onSubmit={handleBuildResume} />
      <TemplatePicker />
      <SectionEdit sections={sections} setSections={setSections} />
      <ATSScore score={atsScore} feedback={feedback} />
      <ExportButton sections={sections} />
    </div>
  );
}

export default App;