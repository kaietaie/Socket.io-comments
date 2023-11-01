import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    const myCookieValue = Cookies.get('myCookieName');

    useDebugValue(auth, auth => auth ? "LogIn" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;