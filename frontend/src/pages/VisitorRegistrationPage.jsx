import { useState, useEffect } from "react";
import userService from "../services/userService";
import { useToast } from "../hooks/toast-messages/useToast";
import { useAuth } from "../hooks/useAuth";
import cc from "../utils/cc";

// TODO: Sivulle pääsee vain linkinkautta, jossa aktiivinen token mukana
//TODO: Email pitää vaihtaa tokenissa tulleen sähköpostin mukaan, eikä tätä pitäisi pystyä muuttamaan
const RegistrationPage = () => {
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    passwordAgain: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    console.log("Errors changed: ", errors);
  }, [errors]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value,
    });
  };

  const checkForEmptyFields = () => {
    const generateErrorMessage = (field, message) => {
      const value =
        registrationData[field] === "" || registrationData[field] === null
          ? "error"
          : "success";
      const existingError = errors[field];
      const errorMessage =
        registrationData[field] === "" || registrationData[field] === null
          ? message
          : existingError
            ? existingError.message
            : "";
      return {
        value: existingError ? existingError.value : value,
        message: errorMessage,
      };
    };

    setErrors({
      firstName: generateErrorMessage("firstName", "Täytä tämä kenttä"),
      lastName: generateErrorMessage("lastName", "Täytä tämä kenttä"),
      password: generateErrorMessage("password", "Täytä tämä kenttä"),
      passwordAgain: generateErrorMessage("passwordAgain", "Täytä tämä kenttä"),
    });
  };

  const errorCheckRegistration = () => {
    let isValid = true;

    const checkForEmptyFieldsOnRegister = () => {
      let isValid = true;
      for (const field in registrationData) {
        if (
          registrationData[field] === "" ||
          registrationData[field] === null
        ) {
          isValid = false;
          break;
        }
      }
      return isValid;
    };

    //TODO: Create separate error checking functions for each field
    errorCheckSimpleInput(registrationData.firstName, "firstName");
    errorCheckSimpleInput(registrationData.lastName, "lastName");
    errorCheckPassword();
    errorCheckPasswordAgain();
    checkForEmptyFields();

    isValid = checkForEmptyFieldsOnRegister();

    for (const field in errors) {
      if (errors[field].value !== "success") {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    if (!errorCheckRegistration()) {
      return;
    }
    try {
      let user = await userService.visitorRegistration(
        registrationData.email,
        registrationData.password,
        registrationData.firstName,
        registrationData.lastName
      );
      addToast("Rekisteröityminen onnistui", { style: "success" });
      login(user);
    } catch (error) {
      addToast("Rekisteröityminen epäonnistui", {
        style: "error",
        autoDismiss: false,
      });
      console.error("Error registering:", error);
    }
  };

  const errorCheckSimpleInput = (fieldValue, fieldName) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (fieldValue === "") {
        newErrors[fieldName] = {
          value: "error",
        };
      } else {
        // Only set to success if the field passes all checks
        newErrors[fieldName] = {
          value: "success",
        };
      }
      return newErrors;
    });
  };

  // reset password errors and check if password is valid
  const errorCheckPassword = () => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (registrationData.password.length < 1) {
        newErrors.password = {
          value: "error",
        };
        return newErrors;
      }

      // Check if the password is too short
      if (registrationData.password.length < 8) {
        newErrors.password = {
          value: "error",
          message: "Salasana liian lyhyt",
        };
      } else {
        // Set password as valid if it's long enough
        newErrors.password = {
          value: "success",
        };
      }

      // Additionally check if passwordAgain needs revalidation
      if (registrationData.passwordAgain) {
        if (registrationData.password !== registrationData.passwordAgain) {
          newErrors.passwordAgain = {
            value: "error",
            message: "Salasanat eivät täsmää",
          };
        } else {
          newErrors.passwordAgain = {
            value: "success",
          };
        }
      } else {
        delete newErrors.passwordAgain;
      }

      return newErrors;
    });
  };

  const errorCheckPasswordAgain = () => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (registrationData.passwordAgain.length < 1) {
        newErrors.passwordAgain = {
          value: "error",
        };
        return newErrors;
      }

      if (
        registrationData.passwordAgain &&
        registrationData.password !== registrationData.passwordAgain
      ) {
        newErrors.passwordAgain = {
          value: "error",
          message: "Salasanat eivät täsmää", // "Passwords do not match"
        };
      } else if (registrationData.passwordAgain) {
        // Set passwordAgain as valid if it matches
        newErrors.passwordAgain = {
          value: "success",
        };
      } else {
        // Clear any existing error if no passwordAgain is provided yet
        delete newErrors.passwordAgain;
      }

      return newErrors;
    });
  };

  const containerClass = "flex flex-col gap-1 relative";
  const errorClass = "text-red-500 absolute top-full mt-1";

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary h-10 w-full r border-b p-1 pl-0 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center border-none h-screen w-screen">
      <div
        className="bg-bgSecondary border-borderPrimary flex h-full  w-full sm:max-w-[600px]
       flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto"
      >
        <div className=" relative bg-primaryColor text-white border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          <p>Vierailijaksi rekisteröityminen</p>
        </div>
        <form
          className="p-8 sm:p-12 grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-regGrid w-full"
          onSubmit={registerHandler}
        >
          {/* First Name */}
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="text"
              name="firstName"
              id="first-name-input"
              placeholder="Etunimi"
              value={registrationData.firstName}
              className={
                inputClass +
                (errors.firstName && errors.firstName.value
                  ? errors.firstName.value === "error"
                    ? " border-red-500"
                    : errors.firstName.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              onBlur={() => {
                errorCheckSimpleInput(registrationData.firstName, "firstName");
              }}
            />
            {errors.firstName && errors.firstName.message && (
              <p className={errorClass}>{errors.firstName.message}</p>
            )}
          </div>

          {/* Last name */}
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="text"
              name="lastName"
              id="last-name-input"
              placeholder="Sukunimi"
              className={
                inputClass +
                (errors.lastName && errors.lastName.value
                  ? errors.lastName.value === "error"
                    ? " border-red-500"
                    : errors.lastName.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.lastName}
              onBlur={() => {
                errorCheckSimpleInput(registrationData.lastName, "lastName");
              }}
            />
            {errors.lastName && errors.lastName.message && (
              <p className={errorClass}>{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 sm:col-span-2 relative">
            <input
              disabled={false} // todo: enable when email is available in token
              type="text"
              name="email"
              id="email-input"
              value={registrationData.email}
              placeholder="Vierailijan@sähköposti.fi"
              onChange={(e) => {
                setRegistrationData({
                  ...registrationData,
                  email: e.target.value,
                });
              }}
              className={cc(
                inputClass,
                errors.email && errors.email.value
                  ? errors.email.value === "error"
                    ? " border-red-500"
                    : errors.email.value === "success"
                      ? " border-green-500"
                      : ""
                  : ""
              )}
            />
          </div>

          {/* Password */}
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="password"
              name="password"
              id="password-input"
              placeholder="Salasana"
              className={
                inputClass +
                (errors.password && errors.password.value
                  ? errors.password.value === "error"
                    ? " border-red-500"
                    : errors.password.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.password}
              onBlur={() => errorCheckPassword()}
            />
            {errors.password && errors.password.message && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          {/* Password Repeat */}
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="password"
              name="passwordAgain"
              id="password-input-2"
              placeholder="Salasana uudelleen"
              className={
                inputClass +
                (errors.passwordAgain && errors.passwordAgain.value
                  ? errors.passwordAgain.value === "error"
                    ? " border-red-500"
                    : errors.passwordAgain.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.passwordAgain}
              onBlur={() => errorCheckPasswordAgain()}
            />
            {errors.passwordAgain && errors.passwordAgain.message && (
              <p className={errorClass}>{errors.passwordAgain.message}</p>
            )}
          </div>

          {/* TODO: Button to the center of the 2 cols when in sm:  */}
          <div className="flex sm:col-span-2 w-full justify-center my-8">
            <button
              className=" text-textPrimary border-borderPrimary bg-primaryColor h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:bg-hoverPrimary active:scale-95"
              type="submit"
            >
              Rekisteröidy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
