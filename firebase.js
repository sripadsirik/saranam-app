import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7lFiOkHpRIbpT8Sp3DzW8Xk1FUlOnItA",
  authDomain: "saranam-app.firebaseapp.com",
  projectId: "saranam-app",
  storageBucket: "saranam-app.appspot.com",
  messagingSenderId: "743042145272",
  appId: "1:743042145272:web:8db707cb815eaf93dcd40d",
  measurementId: "G-XJ8TKYN71K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;

async function initializeFirebaseAuth() {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

initializeFirebaseAuth();

//const analytics = getAnalytics(app);

const db = getFirestore(app);

export { auth, db };
