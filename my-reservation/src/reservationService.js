// reservationService.js
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBnT-HK4agxOQiUioVrZnarIGnUy_pJtqQ",
    authDomain: "ojt1-611bf.firebaseapp.com",
    projectId: "ojt1-611bf",
    storageBucket: "ojt1-611bf.appspot.com",
    messagingSenderId: "34248647421",
    appId: "1:34248647421:web:43674118a70a04f5da5494"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveReservation = async (reservationData) => {
    try {
        await db.collection('reservations').add(reservationData);
        console.log("予約が保存されました");
    } catch (error) {
        console.error("予約保存エラー:", error);
    }
};