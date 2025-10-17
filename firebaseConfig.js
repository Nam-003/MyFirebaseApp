import { firebase } from "@react-native-firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFTJBmMle3T6WmClJl_hvI-g1ES1MiXls",
  authDomain: "myfirebaseapp-da8c3.firebaseapp.com",
  projectId: "myfirebaseapp-da8c3",
  storageBucket: "myfirebaseapp-da8c3.firebasestorage.app",
  messagingSenderId: "583813924837",
  appId: "1:583813924837:web:3efb3b247f4f1ed62b110c",
  measurementId: "G-BVWNVNH2LS",
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
