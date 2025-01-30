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
  const { login } = useAuth();

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const passwordInput = useRef(null);

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  // Function to validate email
  const checkEmail = () => {
    let emailError = "";

    if (!email) {
      emailError = "Sähköposti on pakollinen";
    } else if (!emailRegex.test(email)) {
      emailError = "Sähköposti on väärässä muodossa";
    }

    setErrors((prev) => ({ ...prev, emailError }));
    return !emailError;
  };

  // Function to validate password
  const checkPassword = () => {
    let passwordError = "";

    if (!password) {
      passwordError = "Sähköposti on pakollinen";
    } else if (password.length < 8) {
      passwordError = "Salasanan pituus on vähintään 8 merkkiä";
    }

    setErrors((prev) => ({ ...prev, passwordError }));
    return !passwordError;
  };

  const validateForm = () => {
    const isEmailValid = checkEmail();
    const isPasswordValid = checkPassword();
    return isEmailValid && isPasswordValid;
  };

  const handleLogin = async () => {
    setErrors((prev) => ({ ...prev, errorMessage: "" }));

    if (!validateForm()) {
      return;
    }

    try {
      const user = await userService.login(email, password, stayLoggedIn);
      setEmail("");
      setPassword("");
      login(user);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        errorMessage: "Sähköposti tai salasana väärin",
      }));
      setPassword("");
    }
  };

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center min-h-screen w-screen">
      <div className="bg-bgSecondary border-borderPrimary flex w-full sm:max-w-[500px] flex-col self-center sm:border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-primaryColor text-white border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Kirjautuminen
        </div>
        <div className="relative flex pt-20 flex-col gap-10 p-8 sm:p-12">
          {errors.errorMessage && (
            <div className="bg-red-500 text-white w-full p-1 text-center text-lg rounded-b-md shadow-md transition-all duration-500 absolute -top-1 left-0">
              {errors.errorMessage}
            </div>
          )}
          <div className="flex w-full flex-col gap-1 relative">
            <input
              type="email"
              value={email}
              required
              placeholder="Sähköposti"
              className={`text-lg text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full focus-visible:outline-none focus-visible:border-primaryColor border-b p-1 ${
                errors.emailError ? " border-red-500" : ""
              }`}
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

          <div className="flex w-full flex-col gap-1 relative">
            <input
              className={`text-lg text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full border-b p-1 focus-visible:outline-none focus-visible:border-primaryColor ${
                errors.passwordError ? "border-red-500" : ""
              }`}
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
              <p className="text-red-500 absolute top-full mt-1">
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

            <div className="flex justify-center gap-8">
              <button
                type="button"
                onClick={handleLogin}
                className="text-white border-borderPrimary bg-primaryColor h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:bg-hoverPrimary active:scale-95"
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
    </div>
  );
}

export default LoginPage;
