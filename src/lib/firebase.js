import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAxTeptkTri93ddZfitkShFoqe7Wf7fgd8",
    authDomain: "bloom-6da35.firebaseapp.com",
    projectId: "bloom-6da35",
    storageBucket: "bloom-6da35.firebasestorage.app",
    messagingSenderId: "579199169458",
    appId: "1:579199169458:web:bd1e61ece29c9220052aab",
    measurementId: "G-WJJFBXLYY8"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };
