// reservationService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';

// 日時をFirestore Timestampに変換するユーティリティ関数
const convertToFirestoreTimestamp = (dateTime) => {
    if (dateTime instanceof Date) {
        return Timestamp.fromDate(dateTime); // DateオブジェクトをTimestampに変換
    }

    const [datePart, timePart] = dateTime.split(' ');
    const [year, month, day] = datePart.match(/(\d+)年(\d+)月(\d+)日/).slice(1).map(Number);
    const [hour, minute] = timePart.split('~')[0].split(':').map(Number);
    
    return Timestamp.fromDate(new Date(year, month - 1, day, hour, minute));
};

export const saveReservation = async (reservationData) => {
    try {
        // 日時データを Timestamp に変換
        const firestoreData = {
            ...reservationData,
            datetime: convertToFirestoreTimestamp(reservationData.dateTime),
            status: '予約済', // 予約ステータスを追加
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'reservations'), firestoreData);
        return docRef.id;
    } catch (error) {
        console.error("予約保存エラー:", error.message);
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

// getReservationsFromFirestore関数を追加
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

export const updateReservationStatus = async (reservationId) => {
    try {
        await updateDoc(doc(db, 'reservations', reservationId), {
            status: '予約済'
        });
    } catch (error) {
        console.error("ステータス更新エラー:", error);
    }
};