import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/feedback",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const submitFeedback = async (feedbackData) => {
  const response = await API.post("/", feedbackData);
  return response.data;
};

export const getPublicFeedback = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + "/api/feedback");
  return response.data;
};
