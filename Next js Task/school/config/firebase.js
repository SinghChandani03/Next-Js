
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyANqybmcPLAWHPoYXz-O4Uk7WYa4WnXUTo",
  authDomain: "school-next-task.firebaseapp.com",
  databaseURL: "https://school-next-task-default-rtdb.firebaseio.com",
  projectId: "school-next-task",
  storageBucket: "school-next-task.appspot.com",
  messagingSenderId: "711264304509",
  appId: "1:711264304509:web:d9c398dc1be8433023a014",
  measurementId: "G-DXTEN8SEB0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore  = getStorage(app);

export { app, auth, database, firestore };