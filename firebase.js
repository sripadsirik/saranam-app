import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7lFiOkHpRIbpT8Sp3DzW8Xk1FUlOnItA",
  authDomain: "saranam-app.firebaseapp.com",
  projectId: "saranam-app",
  storageBucket: "saranam-app.appspot.com",
  messagingSenderId: "743042145272",
  appId: "1:743042145272:web:8db707cb815eaf93dcd40d",
  measurementId: "G-XJ8TKYN71K"
  // apiKey: "AIzaSyAWssVKQfoDsrUnMik1S1V_StKU8M2Z80o",
  // authDomain: "saranam-app-4f983.firebaseapp.com",
  // projectId: "saranam-app-4f983",
  // storageBucket: "saranam-app-4f983.appspot.com",
  // messagingSenderId: "415959821048",
  // appId: "1:415959821048:web:e3f3fdd447d357e180a90d",
  // measurementId: "G-QMCSG81CSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;

async function initializeFirebaseAuth() {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
async function fetchUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Ayappa');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));

  return urls;
}

initializeFirebaseAuth();

//const analytics = getAnalytics(app);

const db = getFirestore(app);

export { auth, db, fetchUrls };
