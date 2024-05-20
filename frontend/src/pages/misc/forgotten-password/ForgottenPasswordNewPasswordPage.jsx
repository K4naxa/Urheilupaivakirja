import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect } from "react";
import userService from "../../../services/userService";
import { useLocation } from "react-router-dom";

const ForgottenPasswordNewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;
  const email = location.state?.email;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const {
    mutate: resetPassword,
    isError,
    error,
  } = useMutation({
    mutationFn: () => userService.resetPassword(email, resetToken, password),
    onError: (error) => {
      console.error("Error requesting password reset:", error);
      addToast("Tapahtui virhe, ota yhteyttä ylläpitoon", { style: "error" });
    },
    onSuccess: () => {
      addToast("Salasana vaihdettu onnistuneesti", { style: "success" });
      navigate("/kirjaudu", { replace: true });
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (
      errors.password?.value !== "success" ||
      errors.passwordConfirm?.value !== "success"
    ) {
      addToast("Korjaa virheet ennen lähettämistä", { style: "error" });
      return;
    }
    resetPassword();
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (errors.password || errors.passwordConfirm) {
      errorCheckPassword(newPassword, passwordConfirm);
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const newPasswordConfirm = e.target.value;
    setPasswordConfirm(newPasswordConfirm);
    if (errors.password || errors.passwordConfirm) {
      errorCheckPasswordConfirm(newPasswordConfirm, password);
    }
  };

  const handlePasswordBlur = () => {
    errorCheckPassword(password, passwordConfirm);
  };

  const handlePasswordConfirmBlur = () => {
    errorCheckPasswordConfirm(passwordConfirm, password);
  };

  const errorCheckPassword = (newPassword, newPasswordConfirm) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (newPassword.length < 1) {
        newErrors.password = {
          value: "error",
          message: "Salasana ei voi olla tyhjä",
        };
      } else if (newPassword.length < 8) {
        newErrors.password = {
          value: "error",
          message: "Salasana liian lyhyt",
        };
      } else {
        newErrors.password = {
          value: "success",
        };
      }

      if (newPasswordConfirm && newPassword !== newPasswordConfirm) {
        newErrors.passwordConfirm = {
          value: "error",
          message: "Salasanat eivät täsmää",
        };
      } else if (newPasswordConfirm) {
        newErrors.passwordConfirm = {
          value: "success",
        };
      }

      return newErrors;
    });
  };

  const errorCheckPasswordConfirm = (newPasswordConfirm, newPassword) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (newPasswordConfirm.length < 1) {
        newErrors.passwordConfirm = {
          value: "error",
          message: "Salasana ei voi olla tyhjä",
        };
      } else if (newPassword !== newPasswordConfirm) {
        newErrors.passwordConfirm = {
          value: "error",
          message: "Salasanat eivät täsmää",
        };
      } else {
        newErrors.passwordConfirm = {
          value: "success",
        };
      }

      return newErrors;
    });
  };

  const isFormValid = () => {
    return (
      password.length >= 8 &&
      password === passwordConfirm &&
      errors.password?.value === "success" &&
      errors.passwordConfirm?.value === "success"
    );
  };

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center  h-screen w-screen">
      <div className="bg-bgSecondary border-borderPrimary flex h-full  w-full sm:max-w-[500px] flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Salasanan palautus
        </div>
        <form
          onSubmit={handleSend}
          className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12 items-center justify-center"
        >
          <p>Syötä uusi salasana</p>
          <div className="flex w-full flex-col gap-1 relative">
            <input
              type="password"
              value={password}
              required
              placeholder="Salasana"
              className={`text-lg text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1 ${
                errors.password?.value === "error"
                  ? "border-red-500"
                  : errors.password?.value === "success"
                    ? "border-green-500"
                    : ""
              }`}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />
            {errors.password?.value === "error" && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1 relative">
            <input
              type="password"
              value={passwordConfirm}
              required
              placeholder="Salasana uudelleen"
              className={`text-lg text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1 ${
                errors.passwordConfirm?.value === "error"
                  ? "border-red-500"
                  : errors.passwordConfirm?.value === "success"
                    ? "border-green-500"
                    : ""
              }`}
              onChange={handlePasswordConfirmChange}
              onBlur={handlePasswordConfirmBlur}
            />
            {errors.passwordConfirm?.value === "error" && (
              <p className="text-red-500">{errors.passwordConfirm.message}</p>
            )}
          </div>
          <button
            className="bg-headerPrimary text-bgPrimary w-full h-10 rounded-md"
            type="submit"
            disabled={!isFormValid()}
          >
            Lähetä
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgottenPasswordNewPasswordPage;
