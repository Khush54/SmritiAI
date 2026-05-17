import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/alerts"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAlerts = async () => {
  const response = await API.get("/");
  return response.data;
};

export const markAlertsRead = async () => {
  const response = await API.put("/mark-read");
  return response.data;
};
