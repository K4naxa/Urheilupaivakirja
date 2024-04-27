import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";
import userService from "../../services/userService";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
    <div className="bg-bgkPrimary flex h-screen w-screen  justify-center">
      <div className="bg-bgkSecondary flex  h-fit flex-col gap-4 self-center rounded-md border-2 shadow-md">
        <div className="bg-graphPrimary ce rounded-t-md p-5 text-center text-xl shadow-md">
          Kirjautuminen
        </div>
        <div className="flex flex-col gap-4 p-12">
          <div className=" flex w-full flex-col gap-1">
            <label>Sähköposti</label>
            <input
              type="email"
              value={email}
              required
              className="bg-bgkPrimary text-textPrimary h-10 w-full rounded-md border-2 p-1 "
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordInput.current.focus();
                }
              }}
            />
          </div>

          <div className=" flex w-full flex-col gap-1">
            <label>Salasana</label>
            <input
              className="bg-bgkPrimary text-textPrimary h-10 w-full rounded-md border-2 p-1"
              type="password"
              value={password}
              ref={passwordInput}
              required
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e);
                }
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <div className="flex items-center justify-between">
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

            <div className="flex justify-between gap-1 ">
              <Link to="/rekisteroidy">
                <button
                  type="button"
                  className="text-textPrimary border-graphPrimary cursor-pointer border-2 px-4 py-2 "
                >
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
      <div className="absolute right-5 top-5">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default LoginPage;
