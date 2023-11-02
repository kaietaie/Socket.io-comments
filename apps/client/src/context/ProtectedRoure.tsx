import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ isLogin }: any) => {
  //@ts-ignore
  const { auth } = useAuth();
  const location = useLocation();
isLogin = true
  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
