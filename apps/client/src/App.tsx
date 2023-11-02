import "./App.css";
import Express from "./express/postsExpress";
import Menu from "./menu";
import { Route, Routes } from "react-router-dom";
import Graph from "./with-graphql/postsGraphql";
import "@aws-amplify/ui-react/styles.css";
// import PersistLogin from "./components/PersistLogin";
import LoginComponent from "./components/LoginComponent";
import RegistrationComponent from "./components/RegistrationComponent";

function App() {
  return (
    <>
      <header className="header-menu">
        <Menu />
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/registration" element={<RegistrationComponent />} />

          <Route path="/" element={<Express />} />
          <Route path="/with-graph" element={<Graph />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
