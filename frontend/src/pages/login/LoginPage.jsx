import "./loginPage.css";
import userService from "../../services/userService";
import { useState, useContext, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const passwordInput = useRef(null);

  // Function to check if login input is valid before sending it to backend
  const errorCheckLogin = () => {
    if (email === "" || password === "") {
      setError("Täytä kaikki kentät");
      return false;
    }

    // test if password is long enough
    if (password.length < 8) {
      setError("Salasanan tulee olla vähintään 8 merkkiä pitkä");
      setPassword("");
      return false;
    }
    // test if email is in correct format
    const myRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!myRegEx.test(email)) {
      setError("Sähköposti ei ole oikeassa muodossa");
      setPassword("");
      setEmail("");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!errorCheckLogin()) {
      return;
    }
    try {
      const user = await userService.login(email, password);
      setEmail("");
      setPassword("");
      console.log(user);
      login(user);
    } catch (error) {
      console.log(error);
      setError("Sähköposti tai salasana on väärin");
      return;
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <div className="login-header-container">Kirjautuminen</div>
        <div className="input-container">
          <div className=" login-input-container">
            <label>Sähköposti</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordInput.current.focus();
                }
              }}
            />
          </div>

          <div className=" login-input-container">
            <label>Salasana</label>
            <input
              type="password"
              value={password}
              ref={passwordInput}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e);
                }
              }}
            />
          </div>

          <div className="button-container">
            <div className="upper-container">
              <div className="box">
                <input
                  type="checkbox"
                  name="stayLoggedin"
                  id="stayLoggedIn"
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                />
                <label htmlFor="stayLoggedIn">Pysy kirjautuneena</label>
              </div>
              <div className="box">
                <Link to="/resetPassword">Unohditko salasanasi?</Link>
              </div>
            </div>

            <div className="buttons">
              <Link to="/rekisteroidy">
                <button type="button" className="registerButton button">
                  Rekisteröidy
                </button>
              </Link>
              <button
                type="button"
                onClick={handleLogin}
                className="login-button button"
              >
                Kirjaudu
              </button>
            </div>
          </div>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
