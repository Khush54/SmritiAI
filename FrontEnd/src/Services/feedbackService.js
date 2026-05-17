import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/feedback",
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
  const response = await axios.get("http://localhost:5000/api/feedback");
  return response.data;
};
