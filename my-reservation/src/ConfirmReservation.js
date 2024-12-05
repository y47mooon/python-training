// ConfirmReservation.js
import { saveReservation } from './reservationService';

const handleConfirm = async (reservationData) => {
    await saveReservation(reservationData);
    // 予約が確定しました
};