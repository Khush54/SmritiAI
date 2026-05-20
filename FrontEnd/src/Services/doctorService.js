import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/patients/doctor"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getDoctorDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

export const saveClinicalNote = async (patientId, noteData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/patients/${patientId}/clinical-notes`,
    noteData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  );
  return response.data;
};
