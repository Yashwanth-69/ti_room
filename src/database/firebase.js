
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDcj9tW3IwiNX6chSk0A-ge6eF7F9bcR7I",
    authDomain: "ti-room69.firebaseapp.com",
    projectId: "ti-room69",
    storageBucket: "ti-room69.firebasestorage.app",
    messagingSenderId: "185921566393",
    appId: "1:185921566393:web:9fc7d9532c54a6e9df0d68",
    measurementId: "G-NJ61LP83ZQ"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };