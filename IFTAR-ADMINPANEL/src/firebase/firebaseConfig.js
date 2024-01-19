import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA-Ff-fudpzVCS8q2LKvtmh3tA-h2pRY7k",
  authDomain: "bromag-admin.firebaseapp.com",
  projectId: "bromag-admin",
  storageBucket: "bromag-admin.appspot.com",
  messagingSenderId: "359917764477",
  appId: "1:359917764477:web:671e20eb4f4e37ce479614",
  measurementId: "G-PNVRLT4ZS8",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
