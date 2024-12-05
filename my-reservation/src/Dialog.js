import React from 'react';
import styles from './Dialog.module.css';

const Dialog = ({ message, onClose }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2>{message}</h2>
                <button onClick={onClose}>ログイン</button>
            </div>
        </div>
    );
};

export default Dialog;