import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from './UserContext';
import styles from './ReservationForm.module.css';
import { saveReservation } from './reservationService';
import { formatDateTime } from './dateUtils';

const ReservationForm = () => {
    const location = useLocation();
    const { email: userEmail, selectedDateTime } = location.state || {};
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState(userEmail ||'');
    const [service, setService] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [staff, setStaff] = useState('');
    const [request, setRequest] = useState('');
    const [firetimestate, setFiretimestate] = useState('');
    const navigate = useNavigate();

    const [dateTime, setDateTime] = useState(selectedDateTime || '');

    useEffect(() => {
        if (location.state) {
            const { name, phone, email, service, staff, request, firetimestate } = location.state;
            setName(name || '');
            setPhone(phone || '');
            setEmail(email || userEmail);
            setService(service || '');
            setStaff(staff || '');
            setRequest(request || '');
            setDateTime(selectedDateTime || '');
            setFiretimestate(firetimestate || '');

            console.log("Selected DateTime in Form:", selectedDateTime);
        }
    }, [location.state, userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //氏名の入力チェック
        if (name.length < 1 || name.length > 20) {
            setError('氏名は1文字以上20文字以内で入力してください。');
            return;
        }

        //電話番号の入力チェック
        if (phone.length < 10 || phone.length > 15) {
            setError('電話番号は10桁以上15桁以内で入力してください。');
            return;
        }
        //メールアドレスが空でないことの確認
        if (email.trim() === '') {
            setEmailError('メールアドレスを入力してください');
            return;
        }
        // 予約データを作成
        const reservationData = { 
            name, 
            phone, 
            email, 
            service, 
            staff, 
            request, 
            dateTime: dateTime instanceof Date ? dateTime : new Date(dateTime),
            firetimestate 
        };
    
        // 予約を保存
        await saveReservation(reservationData);
        // ReservationSummaryにデータを渡す
        navigate('/reservation-summary', { state: reservationData });
    };

    const handleBack = () => {
        navigate('/reservation', { state: { userEmail, name, phone, email, service, staff, request, selectedDateTime: dateTime } });
    };

    return (
        <div className={`${styles.reservationFormContainer} ${styles.customReservationForm}`}>
            <button className={styles.backButton} onClick={handleBack} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                戻る
            </button>
            <h1>予約フォーム</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    予約日時: {formatDateTime(new Date(dateTime))}
                </div>
                <div>
                    <label>氏名</label>
                    <input 
                        type="text" 
                        className={styles.reservationInputField}
                        value={name || ''} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>電話番号</label>
                    <input 
                        type="tell" 
                        className={styles.reservationInputField}
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input 
                        type="email" 
                        id="email"
                        className={styles.reservationInputField}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {emailError && <p className="error">{emailError}</p>}
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
                                checked={staff === '佐藤'}
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            佐藤
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="田中" 
                                name="staff" 
                                checked={staff === '田中'}
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            田中
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="鈴木" 
                                name="staff" 
                                checked={staff === '鈴木'}
                                onChange={(e) => setStaff(e.target.value)} 
                            />
                            鈴木
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="担当者なし" 
                                name="staff" 
                                checked={staff === '担当者なし'}
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
                        onChange={(e) => {
                            if (e.target.value.length <= 50) {
                                setRequest(e.target.value);
                            }
                        }} 
                        rows="4" 
                        placeholder="店内での過ごし方や髪型のイメージなどを記入してください。"
                    />
                    {request.length > 50 && <p style={{ color: 'red'}}>要望は50字以内で入力してください。</p>}
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className={styles.reservationSubmitButton}>予約する</button>
            </form>
        </div>
    );
}

export default ReservationForm;
