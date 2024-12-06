// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBnT-HK4agxOQiUioVrZnarIGnUy_pJtqQ",
    authDomain: "ojt1-611bf.firebaseapp.com",
    projectId: "ojt1-611bf",
    storageBucket: "ojt1-611bf.appspot.com",
    messagingSenderId: "34248647421",
    appId: "1:34248647421:web:43674118a70a04f5da5494"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("ログイン成功");
    } catch (error) {
        console.error("ログインエラー:", error);
        throw error; // エラーを呼び出し元に伝える
    }
};

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("ユーザー登録成功:", userCredential.user);
    } catch (error) {
        console.error("ユーザー登録エラー:", error);
        throw error; // エラーを呼び出し元に伝える
    }
};