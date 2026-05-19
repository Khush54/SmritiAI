import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

export const saveUserToDB = async (userData) => {
  const response = await API.post(
    "/save-user",
    userData
  );
  return response.data;
};

export const loginUser = async (firebaseUID) => {
  const response = await API.post(
    "/login",
    { firebaseUID }
  );
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await API.put(
    "/profile",
    profileData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  );
  return response.data;
};
