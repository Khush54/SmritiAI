import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/patients"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getPatients = async () => {
  const response = await API.get("/");
  return response.data;
};

export const addPatient = async (patientData) => {
  const response = await API.post("/", patientData);
  return response.data;
};
