// ConfirmReservation.js
import { saveReservation } from './reservationService';
import { updateReservationStatus } from './updateReservationStatus';
import { formatDateTime } from './dateUtils';

const handleConfirm = async (reservationData, reservationId) => {
    const formattedReservationData = {
        ...reservationData,
        dateTime: reservationData.dateTime instanceof Date ? reservationData.dateTime : new Date(reservationData.dateTime)
    };
    await saveReservation(formattedReservationData);
    await updateReservationStatus(reservationId);
    // 予約が確定しました
};