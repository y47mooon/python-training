// src/Reservation.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTable.css';
import ReservationForm from './ReservationForm';
import { updateReservationStatus } from './updateReservationStatus';
import { saveReservation } from './reservationService';

const ReservationTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: loggedInEmail } = location.state || {}; // location.stateからloggedInEmailを取得
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 現在の週のオフセットを管理
    const [reservations, setReservations] = useState(Array.from({ length: 14 }, () => Array(24).fill(false))); // すべての枠を空に初期化
    const [showDialog, setShowDialog] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null); // 選択した日時を保持
    const [selectedTime, setSelectedTime] = useState(null); // 選択した時間を保持


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
        const time = timeSlots[timeIndex];
        const date = dates[dateIndex];
        
        if (time === "18:00" || time === "18:30") {
            alert("営業時間外です。◎が予約可能時間です。");
        } else if (!reservations[dateIndex][timeIndex]) {
            // 日付、時間、曜日を取得
            const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            const dayOfWeek = days[date.getDay()]; // 曜日を取得
            const formattedDateTime = `${formattedDate} (${dayOfWeek}) ${time}~`; // フォーマット

            setSelectedDateTime(formattedDateTime); // 選択した日時を設定
            navigate('/reservation-form', { state: { email: loggedInEmail, selectedDateTime: formattedDateTime} });
        } else {
            handleConfirm(timeIndex, dateIndex);
        }
    };

    // 予約状況を更新する関数
    const updateReservations = (timeIndex, dateIndex) => {
        const newReservations = [...reservations];
        newReservations[dateIndex][timeIndex] = true; // 予約済みに設定
        setReservations(newReservations);//予約情報を更新
    };

    // 予約確定後に呼び出す関数
    const handleConfirm = async (timeIndex, dateIndex,reservationData) => {
        const reservationId = await saveReservation(reservationData); // 予約情報を保存し、IDを取得
        await updateReservationStatus(reservationId); // ステータスを更新
        updateReservations(timeIndex, dateIndex); // カレンダーを更新
        setShowDialog(true);
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

    // 日の配列を定義
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

    const paddingValue = '40px'; // スペースの値を変可能にする
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