import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";

const EMAIL_REGEX = /^[A-z][@.][A-z0-9-_]{3,24}$/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,12}$/;
const REGISTER_URL = `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/api/auth/signup`;

const RegistrationComponent = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setusername] = useState("");
  const [homePage, setHomePage] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPass, setValidPass] = useState(false);

  const [matchPass, setMatchPass] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(!EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPass(!PASS_REGEX.test(password));
    setValidMatch(password === matchPass);
  }, [password, matchPass]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPass]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
console.log({ username, email, password, homePage })
    try {
      console.log(REGISTER_URL)
      const res = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username, email, password, homePage }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log({res})

      setusername("");
      setEmail("");
      setPassword("");
      setMatchPass("");
      navigate(from, { replace: true });
    } catch (err) {
      setErrMsg(`Registration Failed, ${err}`);
    }
    errRef.current?.focus();
  };

  return (
    <section className="form-container">
      <p ref={errRef} className={errMsg ? "error-message" : "offscreen"}>
        {errMsg}
      </p>
      <h1>Реєстрація користувача</h1>
      <form className="form">
        <TextField
          required
          inputRef={userRef}
          label="Ім'я"
          id="username"
          name="username"
          type="text"
          onChange={(e) => setusername(e.target.value)}
          value={username}
          margin="normal"
          autoComplete="off"
        />
        <TextField
          required
          label="Ел. пошта"
          id="email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          margin="normal"
          autoComplete="off"
          aria-invalid={validEmail ? "false" : "true"}
        />
        <TextField
          required
          label="Пароль"
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          margin="normal"
          aria-invalid={validPass ? "false" : "true"}
        />
        <TextField
          required
          label="Підтвердіть пароль"
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPass(e.target.value)}
          value={matchPass}
          margin="normal"
          aria-invalid={validMatch ? "false" : "true"}
        />
        <TextField
          inputRef={userRef}
          label="Домашня сторінка"
          id="homePage"
          name="homePage"
          type="text"
          onChange={(e) => setHomePage(e.target.value)}
          value={homePage}
          margin="normal"
          autoComplete="off"
        />
          
        <Button
          type="submit"
          className="form-btn"
          size="small"
          variant="contained"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
        {/* <Button
          disabled={!validEmail || !validPass || !validMatch ? true : false}
        >
          Sign Up
        </Button> */}
      </form>
      <p>
        Маєте аккаунт?
        <br />
        <span className="line">
          <Link to="/login">Увійти в аккаунт</Link>
        </span>
      </p>
    </section>
  );
};

export default RegistrationComponent;
