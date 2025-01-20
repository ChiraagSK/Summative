import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyDn6qw1QECDGZdrlBJ0FlCkgsrmaMxdqus",
    authDomain: "summative-bd844.firebaseapp.com",
    projectId: "summative-bd844",
    storageBucket: "summative-bd844.firebasestorage.app",
    messagingSenderId: "804516432364",
    appId: "1:804516432364:web:70f7e3b8826b7160a8d8c9"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };