// reservationService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';

// 日時をFirestore Timestampに変換するユーティリティ関数
const convertToFirestoreTimestamp = (dateTime) => {
    if (dateTime instanceof Date) {
        return Timestamp.fromDate(dateTime);
    }
    return Timestamp.fromDate(new Date(dateTime));
};

// 予約データを保存する関数
export const saveReservation = async (reservationData) => {
    try {
        const firestoreData = {
            name: reservationData.name,
            phone: reservationData.phone,
            email: reservationData.email,
            service: reservationData.service,
            staff: reservationData.staff,
            request: reservationData.request,
            datetime: convertToFirestoreTimestamp(reservationData.dateTime),
            status: '予約済',
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, 'reservations'), firestoreData);
        return docRef.id;
    } catch (error) {
        console.error("予約保存エラー:", error);
        throw error;
    }
};

// 特定の日付範囲の予約を取得する関数
export const getReservationsForDateRange = async (startDate, endDate) => {
    try {
        const q = query(
            collection(db, 'reservations'),
            where('datetime', '>=', Timestamp.fromDate(startDate)),
            where('datetime', '<=', Timestamp.fromDate(endDate))
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            datetime: doc.data().datetime.toDate()
        }));
    } catch (error) {
        console.error("予約取得エラー:", error);
        throw error;
    }
};

// すべての予約を取得する関数
export const getReservationsFromFirestore = async () => {
    try {
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        return reservationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("予約取得エラー:", error);
        return [];
    }
};