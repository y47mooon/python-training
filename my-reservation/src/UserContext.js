import React, { createContext, useContext, useState } from 'react';


//ユーザコンテキストを作成するreact contextの初期化
const UserContext = createContext();

//ユーザ情報を提供するプロバイダーコンポーネント
export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        loggedInEmail: '', //ログインしているユーザメールアドレス
        name: '', //ユーザの名前
        phone: '', //電話番号
        service: '', //選択したサービス
        staff: '', //　選択したスタッフ
        request: '' //要望
    });

    //コンテキストプロバイダーを返し子コンポーネントに
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

//カスタムフック：コンポーネント内でユーザコンテキストを簡単に使用できるようにする
export const useUserContext = () => {
    return useContext(UserContext);
};