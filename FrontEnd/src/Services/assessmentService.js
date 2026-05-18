import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/assessments"
});

// Automatically inject JWT authentication token into requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// FIXED: Removed forced "multipart/form-data" header to allow seamless JSON serialization
export const submitAssessment = async (assessmentPayload) => {
  const response = await API.post("/high-accuracy-eval", assessmentPayload);
  return response.data;
};

export const getPatientAssessments = async (patientId) => {
  const response = await API.get(`/${patientId}`);
  return response.data;
};

export const generateDynamicTest = async (lang = 'en') => {
  const response = await API.get(`/generate-dynamic-test?lang=${lang}`);
  return response.data;
};