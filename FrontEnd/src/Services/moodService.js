import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/mood-logs"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const addMoodLog = async (logData) => {
  const response = await API.post("/", logData);
  return response.data;
};

export const getMoodLogs = async (patientId) => {
  const response = await API.get(`/${patientId}`);
  return response.data;
};
