// src/Reservation.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationTable.css';
import ReservationForm from './ReservationForm';

const ReservationTable = () => {
    const navigate = useNavigate();
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 現在の週のオフセットを管理
    const [reservations, setReservations] = useState(Array.from({ length: 14 }, () => Array(24).fill(false))); // すべての枠を空に初期化

    // 9:00と9:30の枠を予約済みに設定
    const setInitialReservations = () => {
        const newReservations = [...reservations];
        newReservations.forEach((day, index) => {
            day[0] = true; // 9:00
            day[1] = true; // 9:30
        });
        setReservations(newReservations);
    };

    useEffect(() => {
        setInitialReservations();
    }, []);

    const handleCellClick = (timeIndex, dateIndex) => {
        if (!reservations[dateIndex][timeIndex]) {
            navigate('/reservation-form', { state: { timeIndex, dateIndex } }); // 予約フォームに遷移
        } else {
            navigate('/reservation-message'); // 予約が存在する場合は予約メッセージに遷移
        }
    };

    const today = new Date(); // 今日の日付を取得
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7); // オフセットを考慮

    // 2週間分の日付を生成
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        dates.push(date); // Dateオブジェクトを格納
    }

    // 現在の月を取得
    const month = today.toLocaleString('default', { month: 'long' }); // 月の名前を取得

    // 曜日の配列を定義
    const days = ['日', '月', '火', '水', '木', '金', '土','日', '月', '火', '水', '木', '金', '土'];

    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour}:${minute === 0 ? '00' : minute}`;
            timeSlots.push(time);
        }
    }

     const handleScrollToPreviousWeek = () => {
        setCurrentWeekOffset(prev => prev - 1); // 週のオフセットを減少
    };

    const handleScrollToNextWeek = () => {
        setCurrentWeekOffset(prev => prev + 1); // 週のオフセットを増加
    };

    const Reservation =() =>{
        const[showForm, setShowForm] = useState(false);

        const handleClick = () =>{
            setShowForm(true);
        }
    }

    return (
        <div>
            <h2>時間予約</h2>
            <div className="navigation">
                <button className="prev-week-button" onClick={handleScrollToPreviousWeek}>前の週</button>
                <button className="next-week-button" onClick={handleScrollToNextWeek}>次の週</button>
            </div>
            <table className="reservation-table">
                <thead>
                <tr>
                   <th colSpan={16} className="month-cell">{new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth()).toLocaleString('default', { month: 'long' })}の予約状況</th> {/* ここを追加 */}
                </tr>
                    <tr>
                        <th className="day-cell" rowSpan={2}>時間</th>
                        {days.map((day, index) => (
                            <th key={index} className={day === '日' ? 'sunday' : day === '土' ? 'saturday' : ''}>{day}</th>
                        ))}
                        <th className="day-cell" rowSpan={2}>時間</th> 
                    </tr>
                    <tr>
                        {dates.map((date, index) => (
                            <th key={index} className={date.getDay() === 0 ? 'sunday-date' : date.getDay() === 6 ? 'saturday-date' : ''}>{date.getDate()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((time, timeIndex) => (
                        <tr key={timeIndex}>
                            <td className="time-cell">{time}</td>
                            {reservations.map((reservation, dateIndex) => (
                                <td key={dateIndex} className="time-cell" onClick={() => handleCellClick(timeIndex, dateIndex)}>
                                    {reservation[timeIndex] ? <span className="reserved">×</span> : <span className="available">◎</span>}
                                </td>
                            ))}
                            <td className="time-cell" >{time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;