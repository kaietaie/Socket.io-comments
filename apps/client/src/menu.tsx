import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const { pathname } = useLocation();

  if (pathname === "/registration") {
  }
  return (
    <nav>
      <ul className="menu-ul">
        <li
          className={
            pathname === "/login" || pathname === "/registration"
              ? "active"
              : ""
          }
        >
          <Link to="/login">Login</Link>
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
