import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";


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

const auth = getAuth(app);
//const analytics = getAnalytics(app);

const db = getFirestore();

async function addDataToFirestore(data) {
  try {
    const docRef = await addDoc(collection(db, "something-in-the-evening"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { auth, addDataToFirestore };
