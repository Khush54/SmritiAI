import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/assessments"
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

export const generateDynamicTest = async (lang = 'en', patient = null) => {
  const params = new URLSearchParams({ lang });
  if (patient?.id) params.set("patientId", patient.id);
  if (patient?.age) params.set("age", patient.age);

  const response = await API.get(`/generate-dynamic-test?${params.toString()}`);
  return response.data;
};
