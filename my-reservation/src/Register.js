import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './firebase';
import Dialog from './Dialog'; // ダイアログコンポーネントをインポート
import styles from './Register.module.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showDialog, setShowDialog] = useState(false); // ダイアログの表示状態
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('メールアドレスとパスワードを入力してください。');
            return;
        }

        if (!validateEmail(email)) {
            setError('メールアドレスの形式が正しくありません。');
            return;
        }

        try {
            await registerUser(email, password);
            setShowDialog(true);
        } catch (error) {
            console.error("登録エラーの詳細:", error); // エラーの詳細を表示
            setError('登録に失敗しました: ' + error.message);
        }
    };

    const handleCloseDialog = () => {
        setShowDialog(false); // ダイアログを閉じる
        navigate('/'); // ログインページに遷移
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
                <h2>新規会員登録</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">メールアドレス</label>
                        <input 
                            type="email" 
                            id="email" 
                            className={styles.inputField} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">パスワード</label>
                        <input 
                            type="password" 
                            id="password" 
                            className={styles.inputField} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.registerButton}>登録</button>
                </form>
                <p>
                    既にアカウントをお持ちですか？ <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/')}>ログインページはこちら</span>
                </p>
            </div>
            {showDialog && <Dialog message="登録が完了しました。" onClose={handleCloseDialog} />} {/* ダイアログを表示 */}
        </div>
    );
};

export default Register;
