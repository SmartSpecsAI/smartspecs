import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCRK3n2JLiOuLfLu3IuWWzfR948LhbsSl0",
  authDomain: "smartspecs57b.firebaseapp.com",
  projectId: "smartspecs57b",
  storageBucket: "smartspecs57b.firebasestorage.app",
  messagingSenderId: "319144546189",
  appId: "1:319144546189:web:4af31a0902afcfcca1b7c4",
};

const firebase = initializeApp(firebaseConfig);

export { firebase };
