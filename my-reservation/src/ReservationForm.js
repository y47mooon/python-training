import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ReservationForm.module.css';

const ReservationForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [service, setService] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [staff, setStaff] = useState('');
    const [request, setRequest] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { timeIndex, dateIndex } = location.state || {};// クリックした時間と日付のインデックスを取得.デフォの値設定

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError('');

        if (name.length < 1 || name.length > 20) {
            setError('氏名は1文字以上20文字以内で入力してください。');
            return;
        }
        if (phone.length < 10 || phone.length > 15) {
            setError('電話番号は10桁以上15桁以内で入力してください。');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('正しいE-mailアドレスを入力してください。');
            return;
        }
        setError('');
        navigate('/reservation-summary', { state: { name, phone, email, service, staff, request } });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleBack = () => {
        navigate('/reservation');
    };

    return (
        <div className={styles.reservationFormContainer}>
            <button className={styles.backButton} onClick={handleBack} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                戻る
            </button>
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
                    <label>E-mail</label>
                    <input 
                        type="email" 
                        className={styles.reservationInputField}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
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
                <div className={styles.staffLabel}>担当者</div>
                <div className={styles.staffSelectionContainer}>
                    <div className={styles.staffOptions}>
                        <label>
                            <input 
                                type="radio" 
                                value="佐藤" 
                                name="staff" 
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            佐藤
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="田中" 
                                name="staff" 
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            田中
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="鈴木" 
                                name="staff" 
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            鈴木
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="担当者なし" 
                                name="staff" 
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            担当者なし
                        </label>
                    </div>
                </div>
                <div>
                    <label className={styles.requestLabel}>要望</label>
                    <textarea 
                        className={styles.requestTextArea} 
                        value={request} 
                        onChange={(e) => setRequest(e.target.value)} 
                        rows="4" 
                        placeholder="店内での過ごし方や髪型のイメージなどを記入してください。" // プレースホルダーを追加
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className={styles.reservationSubmitButton}>予約する</button>
            </form>
        </div>
    );
};

export default ReservationForm;
