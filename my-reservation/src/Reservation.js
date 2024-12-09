// src/Reservation.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTable.css';
import ReservationForm from './ReservationForm';
import { saveReservation, getReservationsFromFirestore, getReservationsForDateRange } from './reservationService';
import { formatDateTime } from './dateUtils'; // dateUtilsからインポート

const ReservationTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: loggedInEmail } = location.state || {}; // location.stateからloggedInEmailを取得
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 現在の週のオフセットを管理
    const [reservations, setReservations] = useState(Array.from({ length: 14 }, () => Array(24).fill(false))); // すべての枠を空に初期化
    const [showDialog, setShowDialog] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null); // 選択した日時を保持
    const [selectedTime, setSelectedTime] = useState(null); // 選択した時間を保持
    const [confirmedReservations, setConfirmedReservations] = useState(Array.from({ length: 14 }, () => Array(24).fill(false))); // 確定した予約を管理
    
    // 予約が保存されたかどうかのフラグを管理
    const { isSaved, dateIndex, timeIndex } = location.state || {}; // location.stateからisSaved、dateIndex、timeIndexを取得

    // 予約が保存された場合にフラグをリセット
    useEffect(() => {
        if (isSaved) {
            // 確定した予約を更新
            setConfirmedReservations(prev => {
                const newReservations = [...prev];
                if (dateIndex !== undefined && timeIndex !== undefined) {
                    newReservations[dateIndex][timeIndex] = true; // 予約済みに設定
                }
                return newReservations;
            });
        }
    }, [isSaved, dateIndex, timeIndex]); // dateIndexとtimeIndexも依存配列に追加

    useEffect(() => {
        const fetchReservations = async () => {
            const today = new Date();
            const twoWeeksLater = new Date(today);
            twoWeeksLater.setDate(today.getDate() + 14);

            try {
                const reservations = await getReservationsForDateRange(today, twoWeeksLater);
                const newConfirmedReservations = Array.from({ length: 14 }, () => Array(24).fill(false));

                reservations.forEach(reservation => {
                    const reservationDate = reservation.datetime;
                    const dayIndex = Math.floor((reservationDate - today) / (1000 * 60 * 60 * 24));
                    const timeIndex = (reservationDate.getHours() - 9) * 2 + (reservationDate.getMinutes() / 30);

                        if (dayIndex >= 0 && dayIndex < 14 && timeIndex >= 0 && timeIndex < 24) {
                            newConfirmedReservations[dayIndex][timeIndex] = true;
                    }
                });

                setConfirmedReservations(newConfirmedReservations);
            } catch (error) {
                console.error("予約データの取得に失敗しました:", error);
            }
        };

        fetchReservations();
    }, [currentWeekOffset]);

    const handleCellClick = (timeIndex, dateIndex) => {
        const time = timeSlots[timeIndex];
        const date = dates[dateIndex];

        // 日付と時間を組み合わせてDateオブジェクトを作成
        const [hour, minute] = time.split(':').map(Number);
        const formattedDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);

        // 予約済みの時間を確認
        if (confirmedReservations[dateIndex][timeIndex]) {
            alert("この時間は予約済みです。");
            return; // 予約済みの場合は処理を中断
        }

        // 営業時間外のチェック
        if (time === "18:00" || time === "18:30" || time === "9:00" || time === "9:30") {
            alert("営業時間外です。◎が予約可能時間です。");
            return; // 営業時間外の場合も処理を中断
        }

        // 選択した日時を設定
        setSelectedDateTime(formattedDateTime);
        navigate('/reservation-form', { state: { email: loggedInEmail, selectedDateTime: formattedDateTime } });
    };

    // 予約状況を更新する関数
    const updateReservations = (timeIndex, dateIndex) => {
        const newReservations = [...reservations];
        newReservations[dateIndex][timeIndex] = true; // 予約済みに設定
        setReservations(newReservations); // 予約情報を更新
    };

    // 予約確定後に呼び出す関数
    const handleConfirm = async (timeIndex, dateIndex) => {
        const reservationData = { /* 予約データをここに設定 */ };
        const reservationId = await saveReservation(reservationData); // 予約情報を保存し、IDを取得

        // 確定した予約を更新
        setConfirmedReservations(prev => {
            const newReservations = [...prev];
            newReservations[dateIndex][timeIndex] = true; // 確定した予約を更新
            return newReservations;
        });
        
        // カレンダーを再レンダリングするために状態を更新
        setReservations(prev => {
            const newReservations = [...prev];
            newReservations[dateIndex][timeIndex] = true; // カレンダーの状態も更新
            return newReservations;
        });

        // 状態を認するためのログ
        console.log("Confirmed Reservations:", confirmedReservations);
        console.log("Reservations:", reservations);

        // 予約が確定したことを示すダイアログを表示
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
                   <th colSpan={16} className="month-cell">{new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth()).toLocaleString('default', { month: 'long' })}の予約状況</th>
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
                                    ) : (
                                        <>
                                            {confirmedReservations[dateIndex][timeIndex] ? (
                                                <span className="reserved">×</span>
                                            ) : (
                                                <span className="available">◎</span>
                                            )}
                                        </>
                                    ))}
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
            <span className="closed-indicator">ー営業時間外です。</span>
            <button className="next-week-button" onClick={handleScrollToNextWeek}>次の週</button>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>戻る</button> 
        </div>
    );
};

export default ReservationTable;