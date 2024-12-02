import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // 新しいCSSモジュールをインポート

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('ユーザー名とパスワードを入力してください。');
            return;
        }
        console.log('会員登録中...', { username, password });
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
                <h2>新規会員登録</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">ユーザー名</label>
                        <input 
                            type="text" 
                            id="username" 
                            className={styles.inputField} // 新しいスタイルを適用
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">パスワード</label>
                        <input 
                            type="password" 
                            id="password" 
                            className={styles.inputField} // 新しいスタイルを適用
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.registerButton}>登録</button> {/* 新しいボタンスタイルを適用 */}
                </form>
                <p>
                    既にアカウントをお持ちですか？ <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/')}>ログインページはこちら</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
