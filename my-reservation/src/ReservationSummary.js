import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Summary.module.css';

const ReservationSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, phone, email, service, staff, request } = location.state;
    const [showDialog, setShowDialog] = useState(false); // ダイアログの表示状態

    const handleConfirm = () => {
        setShowDialog(true); // ダイアログを表示
    };

    const handleCloseDialog = () => {
        setShowDialog(false); // ダイアログを閉じる
        navigate('/reservation'); // Reservation.jsに遷移
    };

    const handleBack = () => {
        navigate('/reservation-form'); // 予約フォームに遷移
    };

    return (
        <div className={styles.summaryContainer}>
            <h3 className={styles.summaryTitle}>ご予約内容</h3>
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
                </div>
                
                <div className={styles.summaryDetails}>
                    <div className={styles.summaryItem}>氏名: {name}</div>
                    <div className={styles.summaryItem}>電話番号: {phone}</div>
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
        
            {/* カスタムダイアログ */}
            {showDialog && (
                <div style={dialogStyle}>
                    <h3>予約が完了しました。</h3>
                    <button onClick={handleCloseDialog}>閉じる</button> {/* 閉じるボタン */}
                </div>
            )}
        </div>
    );
};

// ダイアログのスタイル
const dialogStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
};

export default ReservationSummary;
