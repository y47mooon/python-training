// 日時と時間をフォーアットする関数
//引数：dateオブジェクト、戻り値：日付文字列
export const formatDateTime = (date) => {
    //引数が有効なdateオブジェクトでない場合
    if (!(date instanceof Date) || isNaN(date)) {
        return '日時が未設定です';
    }
    
    //日付の各要素取得
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    //曜日の配列
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    
    //日時文字列を返す
    return `${year}年${month}月${day}日(${dayOfWeek}) ${hour}:${minute}`;
};

//予約可能かどうかをチェックする関数
export const isTimeSlotAvailable = (timeSlot, reservations) => {
    //予約リストの中に指定された時間枠と同じ時間の予約があるかどうかをチェック
    return !reservations.some(reservation => {
        const reservationTime = reservation.datetime.toDate();
        return reservationTime.getTime() === timeSlot.getTime();
    });
};
    
export const generateTimeSlots = (date = null) => {
    // 時間枠のみ必要な場合（日付指定なし）
    if (!date) {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
            for (let minute of [0, 30]) {
                // 営業時間外をスキップ
                if ((hour === 9 && minute === 0) || 
                    (hour === 9 && minute === 30) || 
                    (hour === 18 && minute === 0) || 
                    (hour === 18 && minute === 30)) {
                    continue;
                }
                const time = `${hour}:${minute === 0 ? '00' : minute}`;
                slots.push(time);
            }
        }
        return slots;
    }


    //9時から18時までの時間枠を生成
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let minute of [0, 30]) {
            //特定の時間枠を除外（営業時間外）
            if ((hour === 9 && minute === 0) || 
                (hour === 9 && minute === 30) || 
                (hour === 18 && minute === 0) || 
                (hour === 18 && minute === 30)) {
                continue;
            }

            //時間枠のdeteオブジェクトを作成
            const slot = new Date(date);
            slot.setHours(hour, minute, 0, 0);
            slots.push(slot);
        }
    }
    return slots;
};

// generateDatesRange 関数を追加
export const generateDatesRange = (currentWeekOffset) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7);

    const dates = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        dates.push(date);
    }
    return dates;
};

// 予約可能時間のバリデーション関数を追加
export const isValidReservationTime = (time, date) => {
    // 営業時間外のチェック
    if (time === "18:00" || time === "18:30" || time === "9:00" || time === "9:30") {
        return {
            isValid: false,
            message: "営業時間外です。◎が予約可能時間です。"
        };
    }

    // 過去の日時チェック
    const now = new Date();
    const reservationDateTime = new Date(date);
    if (reservationDateTime < now) {
        return {
            isValid: false,
            message: "過去の日時は予約できません。"
        };
    }

    return {
        isValid: true,
        message: ""
    };
};

// 予約済み時間のチェック関数を追加
export const isTimeSlotReserved = (dateIndex, timeIndex, confirmedReservations) => {
    return confirmedReservations[dateIndex][timeIndex];
};

// 予約可能時間かどうかを総合的にチェックする関数
export const validateReservationSlot = (time, date, dateIndex, timeIndex, confirmedReservations) => {
    // 営業時間のバリデーション
    const timeValidation = isValidReservationTime(time, date);
    if (!timeValidation.isValid) {
        return timeValidation;
    }

    // 予約済みチェック
    if (isTimeSlotReserved(dateIndex, timeIndex, confirmedReservations)) {
        return {
            isValid: false,
            message: "この時間は予約済みです。"
        };
    }

    return {
        isValid: true,
        message: ""
    };
};

// 日付から配列のインデックスを計算する関数
export const calculateDayIndex = (reservationDate) => {
    const today = new Date();
    const diffTime = reservationDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// 時刻から配列のインデックスを計算する関数
export const calculateTimeIndex = (reservationDate) => {
    const hour = reservationDate.getHours();
    const minutes = reservationDate.getMinutes();
    // 9:00から始まる30分刻みのインデックスを計算
    return (hour - 9) * 2 + (minutes === 30 ? 1 : 0);
};
