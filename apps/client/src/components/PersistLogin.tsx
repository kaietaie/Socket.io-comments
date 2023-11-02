// import { Outlet } from "react-router-dom";
// import { useState, useEffect } from "react";
// import useAuth from "../hooks/useAuth.js";

// const PersistLogin = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const { auth, persist } = useAuth();

//   useEffect(() => {
//     console.log("isLoading: " + isLoading);
//     console.log("auth " + JSON.stringify(auth));
//   }, [auth?.authority, isLoading]);

//   return (
//     <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
//   );
// };

// export default PersistLogin;