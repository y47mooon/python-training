// ConfirmReservation.js
import { saveReservation } from './reservationService';
import { updateReservationStatus } from './updateReservationStatus';

const handleConfirm = async (reservationData, reservationId) => {
    await saveReservation(reservationData);
    await updateReservationStatus(reservationId); // 予約が確定したらステータスを更新
    // 予約が確定しました
};