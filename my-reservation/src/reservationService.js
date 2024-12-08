// reservationService.js
import { db } from './firebase';

export const saveReservation = async (reservationData) => {
    try {
        const docRef = await db.collection('reservations').add(reservationData);
        console.log("予約が保存されました", docRef.id);
        return docRef.id; // 予約IDを返す
    } catch (error) {
        console.error("予約保存エラー:", error);
    }
};