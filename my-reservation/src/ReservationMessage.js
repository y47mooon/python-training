import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationMessage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>予約済み</h2>
            <p>この時間は予約済みです。◎の枠を選択してください。</p>
            <button onClick={() => navigate('/reservation')}>戻る</button> {/* 戻るボタン */}
        </div>
    );
};

export default ReservationMessage;
