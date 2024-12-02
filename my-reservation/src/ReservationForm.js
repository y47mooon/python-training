import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReservationForm.module.css';

const ReservationForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [service, setService] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.length < 1 || name.length > 20) {
            setError('氏名は1文字以上20文字以内で入力してください。');
            return;
        }
        if (phone.length < 10 || phone.length > 15) {
            setError('電話番号は10桁以上15桁以内で入力してください。');
            return;
        }
        setError('');
        navigate('/reservation-summary', { state: { name, phone, service } });
    };

    return (
        <div className={styles.reservationFormContainer}>
            <h1>予約フォーム</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>氏名</label>
                    <input 
                        type="text" 
                        className={styles.reservationInputField}
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>電話番号</label>
                    <input 
                        type="tel" 
                        className={styles.reservationInputField}
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>サービス</label>
                    <select 
                        className={styles.reservationSelectField}
                        value={service} 
                        onChange={(e) => setService(e.target.value)} 
                        required
                    >
                        <option value="">選択してください</option>
                        <option value="カット">カット</option>
                        <option value="カラー">カラー</option>
                        <option value="カット＋カラー">カット＋カラー</option>
                        <option value="カット＋カラー＋トリートメント">カット＋カラー＋トリートメント</option>
                        <option value="パーマ">パーマ</option>
                        <option value="髪質改善">髪質改善</option>
                    </select>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className={styles.reservationSubmitButton}>予約する</button>
            </form>
        </div>
    );
};

export default ReservationForm;
