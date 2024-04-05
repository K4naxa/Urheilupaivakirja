import "./login.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log(email, password);
  };

  return (
    <div className="container">
      <div className="loginContainer">
        <div className="loginHeaderContainer">Kirjautuminen</div>
        <div className="inputContainer">
          <div className=" loginInputContainer">
            <label>Sähköposti</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className=" loginInputContainer">
            <label>Salasana</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="buttonContainer">
            <div className="upperContainer">
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
              <button type="button" className="registerButton Button">
                Rekisteröidy
              </button>
              <button
                type="button"
                onClick={handleLogin}
                className="loginButton Button"
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
