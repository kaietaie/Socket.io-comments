import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    //@ts-ignore
    const { auth } = useContext(AuthContext);

    useDebugValue(auth, auth => auth ? "LogIn" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;