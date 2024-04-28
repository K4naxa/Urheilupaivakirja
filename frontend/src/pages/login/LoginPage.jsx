import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";
import userService from "../../services/userService";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const passwordInput = useRef(null);

  const myRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  // function to check if email is in correct format
  const checkEmail = () => {
    if (email.length < 1) {
      setEmailError("Sähköposti ei voi olla tyhjä");
      return false;
    }
    if (!myRegEx.test(email)) {
      setEmailError("Sähköposti ei ole oikeassa muodossa");
      return false;
    }
    setEmailError("");
    return true;
  };

  const checkPassword = () => {
    if (password.length < 8) {
      setPasswordError("Salasanan tulee olla vähintään 8 merkkiä pitkä");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const errorCheckLogin = () => {
    let isValid = true;

    // test if password is long enough
    if (!checkPassword()) {
      isValid = false;
    }
    // test if email is in correct format
    if (!checkEmail()) {
      isValid = false;
    }
    return isValid;
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
      setPassword("");
      return;
    }
  };

  // TODO: fix the bug regarding using the page in landscape mode > if height is less than content > header is not visible
  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center  h-screen w-screen ">
      <div className="bg-bgkSecondary border-borderPrimary flex h-full min-h-max  w-full md:max-w-[500px] flex-col self-center border shadow-md sm:h-fit sm:rounded-md">
        <div className="bg-graphPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Kirjautuminen
        </div>
        <div className="relative flex h-full pt-20 flex-col gap-8 p-8 sm:p-12">
          {error && (
            // TODO: make this slide down from top
            <div className="">
              <div className="absolute left-0 top-0 flex w-full justify-center bg-red-500 p-1 text-center text-lg  ">
                {error}
              </div>
            </div>
          )}
          <div className=" flex w-full flex-col gap-1 relative">
            <label className="font-bold">Sähköposti</label>
            <input
              type="email"
              value={email}
              required
              className={`bg-bgkPrimary text-textPrimary border-borderPrimary h-10 w-full rounded-md border p-1 ${emailError ? " border-red-500" : ""}`}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordInput.current.focus();
                }
              }}
              onBlur={() => {
                checkEmail();
              }}
            />
            {emailError && (
              <p className="text-red-500 absolute top-full mt-1">
                {emailError}
              </p>
            )}
          </div>

          <div className=" flex w-full flex-col gap-1 relative">
            <label className="font-bold">Salasana</label>
            <input
              className={`bg-bgkPrimary text-textPrimary border-borderPrimary h-10 w-full rounded-md border p-1 ${passwordError ? "border-red-500" : ""}`}
              type="password"
              value={password}
              ref={passwordInput}
              required
              onBlur={() => {
                checkPassword();
              }}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e);
                }
              }}
            />
            {passwordError && (
              <p className=" text-red-500 absolute top-full mt-1 ">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="flex items-center justify-between">
              <div className="box">
                <input
                  type="checkbox"
                  name="stayLoggedin"
                  id="stayLoggedIn"
                  className="mr-1 hover:cursor-pointer"
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                />
                <label htmlFor="stayLoggedIn">Pysy kirjautuneena</label>
              </div>

              <div className="text-blue-600 hover:underline">
                <Link to="/resetPassword">Unohditko salasanasi?</Link>
              </div>
            </div>

            <div className="flex justify-center gap-8 ">
              <button
                type="button"
                onClick={handleLogin}
                className="text-textPrimary border-borderPrimary bg-graphPrimary h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:scale-105 active:scale-95"
              >
                Kirjaudu
              </button>
            </div>
            <div className="flex w-full justify-center gap-2">
              <p className="text-textSecondary">
                Jos sinulla ei ole käyttäjää:
              </p>
              <Link
                to="/rekisteroidy"
                className="text-blue-600 hover:underline"
              >
                Rekisteröidy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-5 top-5">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default LoginPage;
