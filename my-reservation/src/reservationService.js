// reservationService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';

// 日時をFirestore Timestampに変換するユーティリティ関数
const convertToFirestoreTimestamp = (dateTime) => {
    //日付がdateオブジェクトの場合
    if (dateTime instanceof Date) {
        return Timestamp.fromDate(dateTime);
    }
    //それ以外の場合新しいdateオブジェクトを作成して変換
    return Timestamp.fromDate(new Date(dateTime));
};

// 予約データを保存する関数
export const saveReservation = async (reservationData) => {
    try {
        //予約データをオブジェクトとして作成
        const firestoreData = {
            name: reservationData.name,
            phone: reservationData.phone,
            email: reservationData.email,
            service: reservationData.service,
            staff: reservationData.staff,
            request: reservationData.request,
            datetime: convertToFirestoreTimestamp(reservationData.dateTime),//日時をfirebaseのtimestampに変換
            status: '予約済',
            createdAt: Timestamp.now()//作成日時
        };
   
        //firebaseに予約データを追加
        const docRef = await addDoc(collection(db, 'reservations'), firestoreData);
        return docRef.id;//予約IDを返す
    } catch (error) {
        console.error("予約保存エラー:", error);
        throw error;//エラーを再スロー
    }
};

// 特定の日付範囲の予約を取得する関数
export const getReservationsForDateRange = async (startDate, endDate) => {
    try {
        //firestoreのクエリを作成
        const q = query(
            collection(db, 'reservations'),//reservationsコレクションを指定
            where('datetime', '>=', Timestamp.fromDate(startDate)),//開始日時以上
            where('datetime', '<=', Timestamp.fromDate(endDate))//終了日時以下
        );
        
        //クエリを実行してスナップショットを取得
        const snapshot = await getDocs(q);
        //スナップショットからドキュメントをマッピングして返す
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            datetime: doc.data().datetime.toDate()//timestampをdateオブジェクトに変換
        }));
    } catch (error) {
        console.error("予約取得エラー:", error);
        throw error;
    }
};

// すべての予約を取得する関数
export const getReservationsFromFirestore = async () => {
    try {
        // 'reservations'コレクションからすべてのドキュメントを取得
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        // スナップショットからドキュメントをマッピングして返す
        return reservationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("予約取得エラー:", error);
        return [];// エラーが発生した場合は空の配列を返す
    }
};