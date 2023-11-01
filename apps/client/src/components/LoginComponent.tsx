import { useRef, useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const LOGIN_URL = "api/auth/login";

const LoginComponent = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userEmailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");

  //   useEffect(() => {
  //     userEmailRef.current.focus();
  //   }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(persist)
      const accessToken = response.data.access_token;
      setAuth({ accessToken });
      setEmail("");
      setPass("");
      navigate(from, { replace: true });
    } catch (err) {
      setErrMsg("Login Failed");
    }

    //    errRef.current.focus();
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section className="form-container">
      <p
        ref={errRef}
        className={errMsg ? "error-message" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Вхід</h1>
      <form className="form">
        <TextField
          required
          inputRef={userEmailRef}
          label="Ел. пошта"
          id="email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          margin="normal"
        />
        <TextField
          required
          label="Пароль"
          type="password"
          id="password"
          onChange={(e) => setPass(e.target.value)}
          value={password}
          margin="normal"
        />
        <Button
          className="form-btn"
          size="small"
          variant="contained"
          onClick={handleSubmit}
          type="submit"
        >
          Sign In
        </Button>
        {/* <br />
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">Запа'мятати мене</label>
        </div>
        <br /> */}
      </form>
      <p>
        Потрібен аккаунт?
        <br />
        <span className="line">
          <Link to="/registration">Реєстрація</Link>
        </span>
      </p>
    </section>
  );
};

export default LoginComponent;
