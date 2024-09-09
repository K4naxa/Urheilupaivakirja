import { useState, useEffect } from "react";
import teacherService from "../services/teacherService";
import { useToast } from "../hooks/toast-messages/useToast";
import { useAuth } from "../hooks/useAuth";
import cc from "../utils/cc";
import { useQuery, useMutation } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen";
import { useSearchParams } from "react-router-dom";

// TODO: Sivulle pääsee vain linkinkautta, jossa aktiivinen token mukana
// TODO: Email pitää vaihtaa tokenissa tulleen sähköpostin mukaan, eikä tätä pitäisi pystyä muuttamaan
const TeacherRegistrationPage = () => {
  const { addToast } = useToast();
  const { login } = useAuth();
  const [errors, setErrors] = useState({ email: { value: "success" } });
  let [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email") || ""; // Default to empty string if no email in params

  // Set initial state with email from search params
  const [registrationData, setRegistrationData] = useState({
    email: email, // Use email from URL if available
    password: "",
    passwordAgain: "",
    firstName: "",
    lastName: "",
  });

  const registerTeacher = useMutation({
    mutationFn: (newRegistrationData) =>
      teacherService.registerTeacher(newRegistrationData),
    onError: (error) => {
      console.error("Error registering teacher:", error);
      addToast("Virhe rekisteröitäessä käyttäjää", { style: "error" });
    },
    onSuccess: (user) => {
      addToast("Käyttäjä rekisteröity", { style: "success" });
      login(user);
    },
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errorCheckRegistration()) {
      return;
    }
    const registrationDataToSend = {
      token: token,
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName, 
    }
    try {
      registerTeacher.mutate(registrationDataToSend);
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
    ;
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

    const password = registrationData.password;

    // Check if password is empty
    if (password.length < 1) {
      newErrors.password = {
        value: "error",
      };
    } else {
      // Regular expressions for validation
      const lengthCheck = /.{8,}/; // At least 8 characters
      const capitalLetterCheck = /[A-Z]/; // At least one uppercase letter
      const numberCheck = /[0-9]/; // At least one number

      // Check if the password meets the required conditions
      if (
        !lengthCheck.test(password) ||
        !capitalLetterCheck.test(password) ||
        !numberCheck.test(password)
      ) {
        newErrors.password = {
          value: "error",
          message:
            "Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää vähintään yhden ison kirjaimen sekä numeron", 
        };
      } else {
        newErrors.password = {
          value: "success",
        };
      }
    }

    // Revalidate passwordAgain if present
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

    const passwordAgain = registrationData.passwordAgain;

    if (passwordAgain.length < 1) {
      newErrors.passwordAgain = {
        value: "error",
      };
    } else if (registrationData.password !== passwordAgain) {
      newErrors.passwordAgain = {
        value: "error",
        message: "Salasanat eivät täsmää",
      };
    } else {
      newErrors.passwordAgain = {
        value: "success",
      };
    }

    // Ensure that password validation is in sync
    if (!registrationData.password || registrationData.password.length < 1) {
      newErrors.password = {
        value: "error",
      };
    } else {
      // Clear password error if already validated
      delete newErrors.password;
    }

    return newErrors;
  });
};

  const containerClass = "flex flex-col gap-1 relative";
  
    //add absolute to errorClass to make it look better, but
  //beware long error messages (minimum password length etc) will overlap
  //with the input field below the it.
  const errorClass = "text-red-500 mt-1"; 

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary h-10 w-full r border-b p-1 pl-0 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  const disabledInputClass =
    "text-lg text-textPrimary border-borderPrimary rounded-t-lg h-10 w-full r border-b p-1 pl-0 text-opacity-40 bg-bgPrimary focus-visible:outline-none focus-visible:border-primaryColor";

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center border-none h-screen w-screen">
      <div
        className="bg-bgSecondary border-borderPrimary flex h-full  w-full sm:max-w-[600px]
       flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto"
      >
        <div className=" relative bg-primaryColor text-white border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          <p>Opettajaksi rekisteröityminen</p>
        </div>
        <form
          className="p-8 sm:p-12 grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-regGrid w-full"
          onSubmit={handleSubmit}
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
          <div className="flex flex-col gap-1 text-opacity-70 sm:col-span-2 relative">
            <input
              disabled
              type="email"
              name="email"
              id="email-input"
              value={email}
              placeholder="Opettajan@sähköposti.fi"
              onChange={(e) => {
                setRegistrationData({
                  ...registrationData,
                  email: e.target.value,
                });
              }}
              className={cc(
                disabledInputClass,
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

export default TeacherRegistrationPage;
