import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZMAFihh65wjeeygHOZDiLMxe7jQIsg1E",
  authDomain: "eye-cognizance.firebaseapp.com",
  projectId: "eye-cognizance",
  storageBucket: "eye-cognizance.firebasestorage.app",
  messagingSenderId: "513241595509",
  appId: "1:513241595509:web:fbb6bb6665e38b30ab423c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const setUpRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      containerId,
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
      }
    );
  }
};

export const sendOTP = (phoneNumber, appVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
