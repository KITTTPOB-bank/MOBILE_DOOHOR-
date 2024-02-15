import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFohrJ245y9xurT3qX5J9eWWhZjOjrkSA",
    authDomain: "doohor-af5ca.firebaseapp.com",
    projectId: "doohor-af5ca",
    storageBucket: "doohor-af5ca.appspot.com",
    messagingSenderId: "424535389218",
    appId: "1:424535389218:web:f13a16bcb5311a4fb4467b",
    measurementId: "G-QGNNP4NEL3"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
