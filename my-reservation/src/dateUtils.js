// dateUtils.js
export const formatDateTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
        return '日時が未設定です';
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    
    return `${year}年${month}月${day}日(${dayOfWeek}) ${hour}:${minute}`;
};

export const isTimeSlotAvailable = (timeSlot, reservations) => {
    return !reservations.some(reservation => {
        const reservationTime = reservation.datetime.toDate();
        return reservationTime.getTime() === timeSlot.getTime();
    });
};

export const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let minute of [0, 30]) {
            if ((hour === 9 && minute === 0) || 
                (hour === 9 && minute === 30) || 
                (hour === 18 && minute === 0) || 
                (hour === 18 && minute === 30)) {
                continue;
            }
            const slot = new Date(date);
            slot.setHours(hour, minute, 0, 0);
            slots.push(slot);
        }
    }
    return slots;
};