// updateReservationStatus.js
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export const updateReservationStatus = async () => {
    try {
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        const updates = [];

        reservationsSnapshot.forEach((reservationDoc) => {
            const reservationData = reservationDoc.data();
            const { datetime, datetimestate } = reservationData;

            // ここでdatetimeを使って、該当する時間枠を特定
            const currentTime = new Date();
            const reservationTime = new Date(datetime);

            if (reservationTime > currentTime) {
                // 予約がまだ有効な場合、◎から×に変更
                if (datetimestate === '◎') {
                    updates.push(updateDoc(doc(db, 'reservations', reservationDoc.id), {
                        datetimestate: '×' // ステータスを×に変更
                    }));
                }
            } else {
                // 予約がキャンセルされた場合、×から◎に戻す
                if (datetimestate === '×') {
                    updates.push(updateDoc(doc(db, 'reservations', reservationDoc.id), {
                        datetimestate: '◎' // ステータスを◎に戻す
                    }));
                }
            }
        });

        await Promise.all(updates); // すべての更新を並行して実行
        console.log("予約ステータスが更新されました");
    } catch (error) {
        console.error("ステータス更新エラー:", error);
    }
};

export default updateReservationStatus;