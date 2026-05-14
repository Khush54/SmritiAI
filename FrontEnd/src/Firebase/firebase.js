import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBivqbmiCictaHguobCqDX5E8YhtkCVLQE",
  authDomain: "smriti-ai-3e19f.firebaseapp.com",
  projectId: "smriti-ai-3e19f",
  storageBucket: "smriti-ai-3e19f.firebasestorage.app",
  messagingSenderId: "132076676053",
  appId: "1:132076676053:web:a5599fff9287c3bbe9135c",
  measurementId: "G-HGL1E5VT27"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export const googleProvider =
  new GoogleAuthProvider();

export {
  RecaptchaVerifier,
  signInWithPhoneNumber
};

export default app;
