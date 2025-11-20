import axios from "axios";
const BASE = "http://localhost:5000";
export default {
  buildResume: async (inputData) => {
    const res = await axios.post(`${BASE}/resume/build`, inputData);
    return res.data;
  },
  exportResume: async (sections, filetype) => {
    const res = await axios.post(`${BASE}/resume/export`, { sections, filetype }, { responseType: "blob" });
    // Implement download as needed
    return res.data;
  }
};