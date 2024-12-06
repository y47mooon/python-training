import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { login } from './firebase';
import { useUserContext } from './UserContext';

const Login = () => {
    const { setUserInfo } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateEmail(email)) {
            try {
                await login(email, password);
                setUserInfo(prev => ({ ...prev, loggedInEmail: email }));
                navigate('/reservation', { state: { loggedInEmail: email } });
            } catch (err) {
                setError('ログインに失敗しました。');
            }
        } else {
            setError('メールアドレスの形式が正しくありません。');
        }
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

