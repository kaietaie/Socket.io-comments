import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="menu-ul">
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
 