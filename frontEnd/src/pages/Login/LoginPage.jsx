import "./login.css";
import userService from "../../Services/userService";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

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
    const myRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
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
    } catch (error) {
      console.log(error);
      setError("Sähköposti tai salasana on väärin");
    }
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
