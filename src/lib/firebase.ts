import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBc1xJ17fjvSzJl9WsjCTYsGvOi_bzMjVg",
  authDomain: "wirewala-dcccd.firebaseapp.com",
  projectId: "wirewala-dcccd",
  storageBucket: "wirewala-dcccd.firebasestorage.app",
  messagingSenderId: "1023273209129",
  appId: "1:1023273209129:web:c62f50c92f0a853f087b38",
  measurementId: "G-6QLRNQE3M0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
