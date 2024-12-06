import { useUserContext } from './UserContext';

const Logout = () => {
    const { setUserInfo } = useUserContext();

    const handleLogout = () => {
        setUserInfo({ loggedInEmail: '', name: '', phone: '', service: '', staff: '', request: '' }); // 情報をクリア
        // ログアウト処理を追加
    };

    return (
        <button onClick={handleLogout}>ログアウト</button>
    );
};