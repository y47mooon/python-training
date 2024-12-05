import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        //メールアドレスの形式をチェック
        if(!validateEmail(email)){
            setError('メールアドレスの形式で入力してください');
            return;
        }

        navigate('/reservation', { state: { loggedInEmail: email } });
    };

    const validateEmail = (email) =>{
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2>ログイン</h2>
                {error && <p className={styles.error}>{error}</p>}{/*エラーメッセージを表示*/}
                <form onSubmit={handleLogin}>
                    <div>
                        <label>メールアドレス</label>
                        <input 
                            type="email" 
                            className={styles.inputField}
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>パスワード</label>
                        <input 
                            type="password" 
                            className={styles.inputField}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>ログイン</button>
                </form>
                <p>
                    新規登録は <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/register')}>こちら</span> から。
                </p>
            </div>
        </div>
    );
};

export default Login;

