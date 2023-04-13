import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAv7Kuc-z06D_HWxOQpVB_qWeBzsgk0mTs",
  authDomain: "what-sappclone.firebaseapp.com",
  databaseURL: "https://what-sappclone.firebaseio.com",
  projectId: "what-sappclone",
  storageBucket: "what-sappclone.appspot.com",
  messagingSenderId: "183779214338",
  appId: "1:183779214338:web:78299333eb5895df47d31b",
  measurementId: "G-084KPV91NZ"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider()

  export { auth, provider};
  export default db;