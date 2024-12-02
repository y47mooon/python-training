import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReservationSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, phone, service } = location.state || {};
    const [showDialog, setShowDialog] = useState(false); // ダイアログの表示状態

    const handleConfirm = () => {
        setShowDialog(true); // ダイアログを表示
    };

    const handleCloseDialog = () => {
        setShowDialog(false); // ダイアログを閉じる
        navigate('/reservation'); // Reservation.jsに遷移
    };

    return (
        <div>
            <h2>予約内容の確認</h2>
            <p>氏名: {name}</p>
            <p>電話番号: {phone}</p>
            <p>サービス: {service}</p>
            <button onClick={handleConfirm}>予約確定</button> {/* 予約確定ボタン */}

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
