// reservationService.js
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export const saveReservation = async (reservationData) => {
    try {
        await db.collection('reservations').add(reservationData);
        // 予約が保存されました
    } catch (error) {
        console.error("予約保存エラー:", error);
    }
};