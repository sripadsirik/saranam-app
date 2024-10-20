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
  databaseURL: "https://saranam-app-default-rtdb.firebaseio.com",
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

const storage = getStorage(app);

async function fetchUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Ayappa');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchGaneshaUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Ganesha'); // Changed to Ganesha

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchSaiUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Sai Baba');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchDeviUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Devi');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchVishnuUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Vishnu');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchShivaUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Shiva');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchMuruUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Murugan');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

async function fetchHanuUrls() {
  const storage = getStorage();
  const storageRef = ref(storage, '/Songs/Hanuman');

  // Fetch the list of files in the directory
  const res = await listAll(storageRef);

  // Fetch the download URL for each file
  const urls = await Promise.all(res.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return {
      name: item.name,
      url: url,
    };
  }));

  return urls;
}

initializeFirebaseAuth();

//const analytics = getAnalytics(app);

const db = getFirestore(app);

export { auth, db, fetchUrls, fetchGaneshaUrls, fetchSaiUrls, fetchDeviUrls, fetchVishnuUrls, fetchShivaUrls, fetchMuruUrls, fetchHanuUrls, storage };
