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
//firebase初期化
//firebaseconfigを使用してアプリケーション設定
const app = initializeApp(firebaseConfig);
//firestoreデータベースのインスタンスをエクスポート
//アプリケーション全体で使用可能なデータベースを接続
export const db = getFirestore(app);

//ユーザ認証
export const auth = getAuth(app);

//ユーザログイン関数　　引数：メールアドレス、パスワード
export const login = async (email, password) => {
    try {
        //ユーザログイン
        await signInWithEmailAndPassword(auth, email, password);
        //console.log("ログイン成功");
    } catch (error) {
        console.error("ログインエラー:", error);
        throw error; // エラーを呼び出し元に伝える
    }
};

//新規登録関数  引数:メールアドレス、パスワード
export const registerUser = async (email, password) => {
    try {
        //新規ユーザ作成
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //console.log("ユーザー登録成功:", userCredential.user);
    } catch (error) {
        console.error("ユーザー登録エラー:", error);
        throw error; // エラーを呼び出し元に伝える
    }
};