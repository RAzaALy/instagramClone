import firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJPraVQZ1n0vETDSN0qi_z69csCZeSe5A",
  authDomain: "instagramclone-a4e2c.firebaseapp.com",
  projectId: "instagramclone-a4e2c",
  storageBucket: "instagramclone-a4e2c.appspot.com",
  messagingSenderId: "660756579375",
  appId: "1:660756579375:web:a759093f50a6ef575c32da",
  measurementId: "G-CQ29MDLSVV",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
