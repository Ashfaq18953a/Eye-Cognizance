import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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

// Set up reCAPTCHA
export const setUpRecaptcha = (containerId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    containerId,
    {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    },
    auth
  );
};

// Send OTP
export const sendOTP = (phoneNumber, appVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// To verify OTP, use confirmationResult.confirm(otpCode)
