// ConfirmReservation.js
import { saveReservation } from './reservationService';
import { formatDateTime } from './dateUtils';

// 予約データを形成する関数
//渡されたdatetimeがdateオブジェクトでない場合dateオブジェクトにする
const handleConfirm = async (reservationData, reservationId) => {
    const formattedReservationData = {
        //スプレッド演算子で元の予約データをコピー
        ...reservationData,
        //datetimeプロパティをdate型に
        //date型の場合はそのままそうでない場合は新しいdateオブジェクトを作成
        dateTime: reservationData.dateTime instanceof Date ? reservationData.dateTime : new Date(reservationData.dateTime)
    };
    //非同期関数で保存が完了するまで待機
    await saveReservation(formattedReservationData);
    // 予約が確定しました
};