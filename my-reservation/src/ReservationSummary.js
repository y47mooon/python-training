import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Summary.module.css';
import { saveReservation, getReservationsFromFirestore } from './reservationService';
import { formatDateTime } from './dateUtils';

const ReservationSummary = () => {
    //ロケーションの取得
    const location = useLocation();
    const navigate = useNavigate();
    const { name, phone, email, service, staff, request, dateTime } = location.state || {};
    //ダイアログ時の表示
    const [showDialog, setShowDialog] = useState(false);
    //予約保存
    const [isSaved, setIsSaved] = useState(false);
    //日時の取得
    const [dateTimeState, setDateTime] = useState(dateTime || '');

    //datetimeが変更されたとき状態を更新
    useEffect(() => {
        if (dateTime) {
            setDateTime(dateTime);
        }
    }, [dateTime]);

    //予約確定の関数
    const handleConfirm = async () => {
        //すでに予約済の場合
        if (isSaved) {
            console.log("予約はすでに保存されています。");
            return;
        }

        //予約データをオブジェクトとして作成
        const reservationData = {
            name,
            phone,
            email,
            service,
            staff,
            request,
            dateTime: dateTimeState
        };
        
        //既存の予約を確認
        const existingReservations = await checkExistingReservations(dateTimeState);
        if (existingReservations) {
            console.log("この日付の予約はすでに存在します。");
            return;
        }
    
        //予約を保存、成功時状態を更新
        try {
            const reservationId = await saveReservation(reservationData);
            setIsSaved(true);
            setShowDialog(true);
        } catch (error) {
            console.error("予約保存エラー:", error);
        }
    };

    //既存の予約確認
    const checkExistingReservations = async (dateTime) => {
        //firebaseから予約を取得
        const reservations = await getReservationsFromFirestore();
        //予約がすでに存在するか確認
        return reservations.some(reservation => {
            const reservationDateTime = reservation.datetime?.toDate?.() || new Date(reservation.datetime);
            const checkDateTime = new Date(dateTime);
            return reservationDateTime.getTime() === checkDateTime.getTime();
     });
    };

    //ダイアログを閉じる
    const handleCloseDialog = () => {
        setShowDialog(false);
        //予約カレンダーに遷移
        navigate('/reservation', { state: { name, phone, email, service, staff, request, isSaved: true } });
    };

    //戻るボタン
    const handleBack = () => {
        navigate('/reservation-form', { 
            state: { 
                selectedDateTime: dateTime || dateTime, 
                name,
                phone, 
                email, 
                service, 
                staff, 
                request 
            } 
        });
    };

    return (
        <div className={styles.summaryContainer}>
            <h3 className={`${styles.summaryTitle}`}>ご予約内容</h3>
            <div className={styles.container}>
                <div className={styles.storeInfo}>
                    <h3>店舗名: 〇〇</h3>
                    <p>
                        <span>📞</span> 00-0000-0000
                    </p>
                    <p>
                        <a href="https://www.google.com/maps/search/?api=1&query=japan" target="_blank" rel="noopener noreferrer">
                            日本 - japan
                        </a>
                    </p>
                    <div>
            <img src="https://photo-chips.com/user_data/00007330_7c9157.jpg" alt="容" className={styles.bottomLeftImage} /> {/* 画像を追加 */}
            </div>
                </div>
                <div className={styles.summaryDetails}>
                    <div className={styles.summaryItem}>予約日時: {formatDateTime(new Date(dateTime))} {/* dateTimeを文字列に変換 */}</div>
                    <div className={styles.summaryItem}>氏名: {name}</div>
                    <div className={styles.summaryItem}>電話番号: {phone}</div>
                    <div className={styles.summaryItem}>E-mail: {email}</div>
                    <div className={styles.summaryItem}>サービス: {service}</div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>担当者:</span>
                        <span className={styles.value}>{staff || '指定なし'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>要望:</span>
                        <span className={styles.value}>{request || 'なし'}</span>
                    </div>
                </div>
            </div>
            <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button className={styles.confirmButton} onClick={handleConfirm}>予約確定</button>
                <button className={styles.backButton} onClick={handleBack}>戻る</button>
            </div>
            {showDialog && (
                <div style={dialogStyle}>
                    <h3>予約が完了しました。</h3>
                    <button onClick={handleCloseDialog}>閉じる</button>
                </div>
            )}
        </div>
    );
};

const dialogStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
};

export default ReservationSummary;
