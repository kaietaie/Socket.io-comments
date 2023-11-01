import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Menu = () => {
  const { pathname } = useLocation();
  const auth = useAuth();
  console.log(auth)
  return (
    <nav>

      <ul className="menu-ul">
        <li className={pathname === "/login" ? "active" : ""}>
          <Link to="/login">Увійти</Link>
        </li>
        <li className={pathname === "/" ? "active" : ""}>
          <Link to="/">Express</Link>
        </li>
        <li className={pathname === "/with-graph" ? "active" : ""}>
          <Link to="/with-graph">Graph</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
 