import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/assessments"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const submitAssessment = async (patientId, answers) => {
  const response = await API.post("/", { patientId, answers });
  return response.data;
};

export const getPatientAssessments = async (patientId) => {
  const response = await API.get(`/${patientId}`);
  return response.data;
};
