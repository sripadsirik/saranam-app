import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

const auth = getAuth(app);
//const analytics = getAnalytics(app);

const db = getFirestore();

async function addDataToFirestore(data) {
  try {
    // Convert day to Timestamp and phone to number
    console.log(`Day: ${data.Day}, Phone: ${data.phoneNumber}`);
    const newData = {
      ...data,
      day: Timestamp.fromDate(new Date(data.Day)),
      phoneNumber: Number(data.phoneNumber)
    };

    console.log(newData);

    // Create a query against the collection
    // const q = query(collection(db, "something-in-the-evening"), 
    //   // where("fullName", "==", newData.fullName),
    //   // where("name", "==", newData.name),
    //   // where("note", "==", newData.note),
    //   where("Day", "==", newData.Day),
    //   where("phoneNumber", "==", newData.phoneNumber)
    // );

    // const querySnapshot = await getDocs(q);
    // if (!querySnapshot.empty) {
    //   // Document with same fields already exists
    //   Alert.alert("Duplicate Entry", "A document with the same fields already exists.");

    //   // Log the duplicate fields
    //   querySnapshot.forEach((doc) => {
    //     console.log("Duplicate document data:", doc.data());
    //   });
    //   return;
    // }

    const docRef = await addDoc(collection(db, "something-in-the-evening"), newData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { auth, addDataToFirestore };
