// updateReservationStatus.js
import { db } from './firebase';

export const updateReservationStatus = async (reservationId) => {
    try {
        await db.collection('reservations').doc(reservationId).update({
            status: 'unavailable' // 予約不可に変更
        });
        console.log("ステータスが更新されました");
    } catch (error) {
        console.error("ステータス更新エラー:", error);
    }
};

export default updateReservationStatus;