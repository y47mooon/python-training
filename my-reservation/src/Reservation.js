// src/Reservation.js
import React from 'react';
import './ReservationTable.css'; // CSSファイルをインポート

const ReservationTable = () => {
    const month = "2023年10月"; // 固定の月
    const startDate = new Date(2023, 9, 1); // 10月の初日
    const days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i); // 1日から14日までの日付を生成
        return date;
    });

    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour}:${minute === 0 ? '00' : minute}`;
            timeSlots.push(time);
        }
    }

    // 予約状況のサンプルデータ（ここではランダムに設定）
    const reservations = Array.from({ length: 14 }, () => 
        Array.from({ length: timeSlots.length }, () => Math.random() > 0.5)
    );

    return (
        <div>
            <h2>{month}の予約状況</h2>
            <table className="reservation-table">
                <thead>
                    <tr>
                        <th className="time-cell">時間</th>
                        {days.map((date) => (
                            <th key={date.toString()} className="date-cell">{date.getDate()}</th>
                        ))}
                        <th className="time-cell">時間</th>
                    </tr>
                    <tr>
                        <th></th>
                     {days.map((date) => (
                            <th key={date.toString() + '-day'} className="day-cell">
                                {['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'][date.getDay()]}
                            </th>
                     ))}
                     <th></th>
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((time, timeIndex) => (
                        <tr key={time}>
                            <td className="time-cell">{time}</td>
                            {reservations.map((reservation, dayIndex) => (
                                <td key={dayIndex} className={days[dayIndex].getDay() === 0 ? 'sunday' : days[dayIndex].getDay() === 6 ? 'saturday' : ''}>
                                    {reservation[timeIndex] ? <span className="reserved">×</span> : <span className="available">◎</span>}
                                </td>
                                ))}
                            <td className="time-cell">{time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;