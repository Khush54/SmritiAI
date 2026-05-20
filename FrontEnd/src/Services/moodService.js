import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/mood-logs"
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
