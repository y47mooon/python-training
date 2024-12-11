// updateReservationStatus.js
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export const updateReservationStatus = async () => {
    try {
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        const updates = [];

        reservationsSnapshot.forEach((reservationDoc) => {
            const reservationData = reservationDoc.data();
            const { firetimestate } = reservationData;

            const currentTime = new Date();
            const reservationTime = new Date(firetimestate);

            if (reservationTime > currentTime) {
                // 予約がまだ有効な場合、◎から×に変更
                updates.push(updateDoc(doc(db, 'reservations', reservationDoc.id), {
                    datetimestate: '×' // ステータスを×に変更
                }));
            } else {
                // 予約がキャンセルされた場合、×から◎に戻す
                updates.push(updateDoc(doc(db, 'reservations', reservationDoc.id), {
                    datetimestate: '◎' // ステータスを◎に戻す
                }));
            }
        });

        await Promise.all(updates);
        console.log("予約ステータスが更新されました");
    } catch (error) {
        console.error("ステータス更新エラー:", error);
    }
};

export default updateReservationStatus;