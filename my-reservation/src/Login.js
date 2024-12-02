import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/reservation');
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2>ログイン</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>ユーザー名</label>
                        <input 
                            type="text" 
                            className={styles.inputField}
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
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

