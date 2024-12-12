// src/Reservation.js
import React, { useState, useEffect } from 'react';
import { 
    formatDateTime,
    generateDatesRange,
    generateTimeSlots,
    isTimeSlotAvailable,
    isTimeSlotReserved,
    isValidReservationTime,
    validateReservationSlot,
    calculateDayIndex,
    calculateTimeIndex
} from './dateUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTable.css';
import ReservationForm from './ReservationForm';
import { saveReservation, getReservationsFromFirestore, getReservationsForDateRange } from './reservationService';

const ReservationTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: loggedInEmail } = location.state || {}; // location.stateからloggedInEmailを取得
    const [selectedDateTime, setSelectedDateTime] = useState(null); // 選択した日時を保持
    const [selectedTime, setSelectedTime] = useState(null); // 選択した時間を保持
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [reservations, setReservations] = useState(() => 
        Array(14).fill().map(() => Array(24).fill(false))
    );
    const [confirmedReservations, setConfirmedReservations] = useState(Array(14).fill(Array(24).fill(false))); // 初期化を追加
    const [showDialog, setShowDialog] = useState(false);
    const [formattedDateTime, setFormattedDateTime] = useState('');

    // パディング値の定義
    const paddingValue = '40px';

    // 曜日の配列を定義
    const days = ['日', '月', '火', '水', '木', '金', '土','日', '月', '火', '水', '木', '金', '土'];

    // 時間枠の配列を定義
    const timeSlots = [
        "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30"
    ];

    // 日付の配列を生成
    const dates = generateDatesRange(currentWeekOffset);

    // getFirstDayOfWeek関数の定義
    const getFirstDayOfWeek = (date, offset) => {
        const firstDay = new Date(date);
        firstDay.setDate(date.getDate() - date.getDay() + (offset * 7));
        return firstDay;
    };

    const today = new Date();
    const firstDayOfWeek = getFirstDayOfWeek(today, currentWeekOffset);

    // handleScrollToPreviousWeek関数の定義
    const handleScrollToPreviousWeek = () => {
        setCurrentWeekOffset(prev => prev - 1);
    };

    // handleScrollToNextWeek関数の定義
    const handleScrollToNextWeek = () => {
        setCurrentWeekOffset(prev => prev + 1);
    };

    // handleCellClick関数の定義
    const handleCellClick = (timeIndex, dateIndex) => {
        const time = timeSlots[timeIndex];
        const date = dates[dateIndex];

        const validation = validateReservationSlot(time, date, dateIndex, timeIndex, confirmedReservations);
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        const [hour, minute] = time.split(':').map(Number);
        const selectedDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
        navigate('/reservation-form', { 
            state: { 
                email: loggedInEmail, 
                selectedDateTime: selectedDateTime 
            } 
        });
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const today = new Date();
                const twoWeeksLater = new Date(today);
                twoWeeksLater.setDate(today.getDate() + 14);
                
                const reservations = await getReservationsForDateRange(today, twoWeeksLater);
                updateReservationStatus(reservations);
            } catch (error) {
                console.error("予約データの取得に失敗:", error);
            }
        };

        fetchReservations();
    }, [currentWeekOffset]);

    const updateReservationStatus = (reservations) => {
        const newConfirmedReservations = Array(14).fill().map(() => Array(24).fill(false));
        
        reservations.forEach(reservation => {
            const reservationDate = new Date(reservation.dateTime);
            const dayIndex = calculateDayIndex(reservationDate);
            const timeIndex = calculateTimeIndex(reservationDate);
            
            if (dayIndex >= 0 && dayIndex < 14 && timeIndex >= 0 && timeIndex < 24) {
                newConfirmedReservations[dayIndex][timeIndex] = true;
            }
        });
        
        setConfirmedReservations(newConfirmedReservations);
    };

    // 以下、既存のJSXコードは変更なし
    return (
        <div style={{ padding: `0 ${paddingValue}` }}> {/* 左右にスペースを追加 */}
            <h2 className="time-header">時間予約</h2>
            <h3 className="reservation-prompt">希望予約日時を選択してださい</h3>
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