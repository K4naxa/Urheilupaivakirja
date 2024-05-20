import ThemeSwitcher from "../components/themeSwitcher";
import userService from "../services/userService";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function LoginPage() {
  const [errors, setErrors] = useState({
    errorMessage: "",
    emailError: "",
    passwordError: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const passwordInput = useRef(null);

  const myRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  // function to check if email is in correct format
  const checkEmail = () => {
    setErrors({ ...errors, emailError: "" });
    if (email.length < 1) {
      setErrors({ ...errors, emailError: "Sähköposti on pakollinen" });

      return false;
    }
    if (!myRegEx.test(email)) {
      setErrors({ ...errors, emailError: "Sähköposti on väärässä muodossa" });
      return false;
    }
    return true;
  };

  const checkPassword = () => {
    setErrors({ ...errors, passwordError: "" });
    if (password.length < 8) {
      setErrors({
        ...errors,
        passwordError: "Salasanan pituus on vähintään 8 merkkiä",
      });

      return false;
    }
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

  const handleLogin = async () => {
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
      setErrors({ ...errors, errorMessage: "Sähköposti tai salasana väärin" });
      setPassword("");
      return;
    }
  };

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center  h-screen w-screen">
      <div className="bg-bgSecondary border-borderPrimary flex h-full  w-full sm:max-w-[500px] flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Kirjautuminen
        </div>
        <div className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12">
          {errors.errorMessage && (
            // TODO: make the error message appear by sliding down from the top
            <div className="bg-red-500 text-white w-full p-1 text-center text-lg rounded-b-md shadow-md transition-all duration-500 absolute top-0 left-0">
              {errors.errorMessage}
            </div>
          )}
          <div className="flex w-full justify-center gap-8">
            <button
              onClick={() => {
                setEmail("student@example.com");
                setPassword("salasana");
              }}
              className="Button  w-24"
            >
              Student
            </button>
            <button
              onClick={() => {
                setEmail("teacher@example.com");
                setPassword("salasana");
              }}
              className="Button w-24"
            >
              Teacher
            </button>
          </div>
          <div className=" flex w-full flex-col gap-1 relative">
            <input
              type="email"
              value={email}
              required
              placeholder="Sähköposti"
              className={` text-lg  text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1 ${errors.emailError ? " border-red-500" : ""}`}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordInput.current.focus();
                }
              }}
            />
            {errors.emailError && (
              <p className="text-red-500 absolute top-full mt-1">
                {errors.emailError}
              </p>
            )}
          </div>

          <div className=" flex w-full flex-col gap-1 relative">
            {/* <label className="font-bold">Salasana</label> */}
            <input
              className={` text-lg text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full border-b p-1 focus-visible:outline-none focus-visible:border-headerPrimary ${errors.passwordError ? "border-red-500" : ""}`}
              type="password"
              placeholder="Salasana"
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
            {errors.passwordError && (
              <p className=" text-red-500 absolute top-full mt-1 ">
                {errors.passwordError}
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
                <Link to="/unohditko-salasanasi">Unohditko salasanasi?</Link>
              </div>
            </div>

            <div className="flex justify-center gap-8 ">
              <button
                type="button"
                onClick={handleLogin}
                className="text-textPrimary border-borderPrimary bg-headerPrimary h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:scale-105 active:scale-95"
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
