import firebase from "firebase"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBJlrXS1m9Cm6ig8XjJ9dg1o8T-Wy8WiCQ",
    authDomain: "dovetail-4ef25.firebaseapp.com",
    projectId: "dovetail-4ef25",
    storageBucket: "dovetail-4ef25.appspot.com",
    messagingSenderId: "321779438423",
    appId: "1:321779438423:web:9953e3dca85d968f58a412"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage }