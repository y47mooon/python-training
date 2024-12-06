// src/Reservation.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTable.css';
import ReservationForm from './ReservationForm';

const ReservationTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedInEmail } = location.state || {}; // メールアドレスを取得
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 現在の週のオフセットを管理
    const [reservations, setReservations] = useState(Array.from({ length: 14 }, () => Array(24).fill(false))); // すべての枠を空に初期化

    // 9:00と9:30の枠を予約済みに設定
    const setInitialReservations = () => {
        const newReservations = [...reservations];
        newReservations.forEach((day, index) => {
            day[0] = true; // 9:00
            day[1] = true; // 9:30
        });
        setReservations(newReservations); //予約済みの枠を設定
    };

    useEffect(() => {
        setInitialReservations();
    }, []); //初期化

    const handleCellClick = (timeIndex, dateIndex) => {
        const time = timeSlots[timeIndex]; // クリックされた時間を取得
        if (time === "18:00" || time === "18:30") {
            alert("営業時間外です。◎が予約可能時間です。"); // アラートを表示
        } else if (!reservations[dateIndex][timeIndex]) {
            navigate('/reservation-form', { state: { timeIndex, dateIndex, loggedInEmail } }); // メールアドレスを渡す
        } else {
            handleClose();
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
    for (let hour = 9; hour <= 18; hour++) {
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
        const[showForm, setShowForm] = useState(false);//予約状態を管理

        const handleClick = () =>{
            setShowForm(true);//予約フォームを表示
        }
    }

    function handleClose() {
        alert("営業時間外です。◎が予約可能時間です。");
    }        

    const paddingValue = '40px'; // スペースの値を変更可能にする
    return (
        <div style={{ padding: `0 ${paddingValue}` }}> {/* 左右にスペースを追加 */}
            <h2 className="time-header">時間予約</h2>
            <h3 className="reservation-prompt">希望予約日時を選択してください</h3>
            <table className="reservation-table"></table>
            <div className="navigation">
                <button className="prev-week-button" onClick={handleScrollToPreviousWeek}>前の週</button>
                <button className="next-week-button" onClick={handleScrollToNextWeek}>次の週</button>
            </div>
            <table className="reservation-table">
                <thead>
                <tr>
                   <th colSpan={16} className="month-cell">{new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth())
                   .toLocaleString('default', { month: 'long' })}の予約状況</th> {/* ここを追加 */}
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
                            <td className={`time-cell left-right-background`}>{time}</td>
                            {reservations.map((reservation, dateIndex) => (
                                <td key={dateIndex} className={`time-cell ${time === "18:00" || time === "18:30" ? 
                                'light-gray-background' : (time === "9:00" || time === "9:30" ? 'reserved-background' : 
                                (timeIndex >= 3 && timeIndex <= 12 ? 'custom-background' : ''))}`} onClick={() => handleCellClick(timeIndex, dateIndex)}>
                                   
                                   {time === "9:00" || time === "9:30" ? (
                                        <span className="reserved">-</span> // 9:00と9:30の表示
                                    ) : (time === "18:00" || time === "18:30" ? (
                                        <span className="reserved">-</span> // 18:00と18:30の表示
                                    ) : (reservation[timeIndex] ? (
                                        <span className="reserved">×</span>
                                    ) : (
                                        <span className="available">◎</span>
                                    )))}
                                </td>
                            ))}
                            <td className={`time-cell left-right-background`}>{time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="status-indicator" style={{ marginTop: '20px' }}> {/* 新たなスペースを作成 */}
            <button className="prev-week-button" onClick={handleScrollToPreviousWeek}>前の週</button>
            <span className="available-indicator">◎：予約可能時間です。</span>
            <span className="reserved-indicator">×：予約済みです。</span>
            <span className="closed-indicator">ー：営業時間外です。</span>
            <button className="next-week-button" onClick={handleScrollToNextWeek}>次の週</button>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>戻る</button> 
        </div>
    );
};

export default ReservationTable;