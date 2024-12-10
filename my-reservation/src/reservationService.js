// reservationService.js
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const saveReservation = async (reservationData) => {
    try {
        const docRef = await addDoc(collection(db, 'reservations'), reservationData);
        console.log("予約が保存されました", docRef.id);
        return docRef.id; // 予約IDを返す
    } catch (error) {
        console.error("予約保存エラー:", error.message); // エラーメッセージを表示
    }
};

export const getReservationsFromFirestore = async () => {
    const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
    const reservations = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reservations;
};