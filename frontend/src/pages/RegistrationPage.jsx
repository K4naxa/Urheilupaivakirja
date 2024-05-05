import { useState, useEffect, useRef } from "react";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import publicService from "../services/publicService";
import ThemeSwitcher from "../components/themeSwitcher";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { check } from "prettier"; // TODO: <-- What is this?
import { useToast } from "../hooks/toast-messages/useToast";

const RegistrationPage = () => {
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    passwordAgain: "",
    firstName: "",
    lastName: "",
    phone: "",
    sportId: null,
    groupId: null,
    campusId: null,
    newSport: "",
  });
  const [options, setOptions] = useState({
    student_groups: [],
    sports: [],
    campuses: [],
  });
  const [errors, setErrors] = useState({});
  const { addToast, removeToast, toasts } = useToast();
  //inputRef = useRef(null);

  console.log("Rerendering the whole component");

  // fetch options for registration form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsData = await publicService.getOptions();
        setOptions(optionsData);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Registrations changed: ", registrationData);
  }, [registrationData]);

  useEffect(() => {
    console.log("Errors changed: ", errors);
  }, [errors]);

  const navigate = useNavigate();

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
      email: generateErrorMessage("email", "Täytä tämä kenttä"),
      password: generateErrorMessage("password", "Täytä tämä kenttä"),
      passwordAgain: generateErrorMessage("passwordAgain", "Täytä tämä kenttä"),
      phone: generateErrorMessage("phone", "Täytä tämä kenttä"),
      sportId: generateErrorMessage("sportId", "Valitse laji"),
      groupId: generateErrorMessage("groupId", "Valitse ryhmä"),
      campusId: generateErrorMessage("campusId", "Valitse toimipaikka"),
    });
  };

  const errorCheckRegistration = () => {
    let isValid = true;

    //TODO: Create separate error checking functions for each field
    errorCheckSimpleInput(registrationData.firstName, "firstName");
    errorCheckSimpleInput(registrationData.lastName, "lastName");
    errorCheckEmail();
    errorCheckPassword();
    errorCheckPasswordAgain();
    errorCheckPhone();
    errorCheckDropdown(registrationData.sportId, "sportId");
    errorCheckDropdown(registrationData.groupId, "groupId");
    errorCheckDropdown(registrationData.campusId, "campusId");

    checkForEmptyFields();

    for (const field in errors) {
      if (errors[field].value !== "success") {
        isValid = false;
        break;
      }
    }
    console.log(isValid);
    return isValid;
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    if (!errorCheckRegistration()) {
      return;
    }
    try {
      await userService.register(
        registrationData.email,
        registrationData.password,
        registrationData.firstName,
        registrationData.lastName,
        registrationData.phone,
        registrationData.sportId,
        registrationData.groupId,
        registrationData.campusId
      );
      addToast("Rekisteröityminen onnistui", { style: "success" });
      navigate("/login");
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

  // reset email errors and check if email is valid
  const errorCheckEmail = () => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

      if (registrationData.email.length < 1) {
        newErrors.email = {
          value: "error",
        };
      } else if (!emailRegEx.test(registrationData.email)) {
        newErrors.email = {
          value: "error",
          message: "Sähköposti ei ole oikeassa muodossa",
        };
      } else {
        // Successfully validate the email
        newErrors.email = {
          value: "success",
        };
      }

      return newErrors;
    });
  };

  const errorCheckPhone = () => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const phoneRegEx = /^\d{10,12}$/g;

      if (registrationData.phone.length < 1) {
        newErrors.phone = {
          value: "error",
        };
      } else if (!phoneRegEx.test(registrationData.phone)) {
        newErrors.phone = {
          value: "error",
          message: "Puhelinnumero ei ole oikeassa muodossa",
        };
      } else {
        newErrors.phone = {
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

  const errorCheckDropdown = (fieldValue, fieldName) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Assume that an empty string or a specific default value indicates no valid selection
      if (fieldValue === "" || fieldValue === "default") {
        newErrors[fieldName] = {
          value: "error",
          message: "Valitse vaihtoehto", // "Select an option" in Finnish
        };
      } else {
        // If a valid option is selected, mark it as successful
        newErrors[fieldName] = {
          value: "success",
        };
      }

      return newErrors;
    });
  };

  const handleDropdownChange = (event) => {
    changeHandler(event);

    errorCheckDropdown(event.target.value, event.target.name);
  };

  const containerClass = "flex flex-col gap-1 relative";
  const errorClass = "text-red-500 absolute top-full mt-1";

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary h-10 w-full r border-b p-1 pl-0 bg-bgkSecondary focus-visible:outline-none focus-visible:border-headerPrimary";

  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center border-none h-screen w-screen">
      <div
        className="bg-bgkSecondary border-borderPrimary flex h-full  w-full sm:max-w-[600px]
       flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto"
      >
        <div className=" relative bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          <p>Rekisteröityminen</p>

          <Link
            to="/LoginPage"
            className="absolute bottom-1/2 translate-y-1/2 left-5 text-3xl"
          >
            <FiArrowLeft />
          </Link>
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
              onChange={changeHandler}
              type="text"
              name="email"
              id="email-input"
              placeholder="Sähköposti"
              className={
                inputClass +
                (errors.email && errors.email.value
                  ? errors.email.value === "error"
                    ? " border-red-500"
                    : errors.email.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.email}
              onBlur={() => {
                errorCheckEmail();
              }}
            />
            {errors.email && errors.email.message && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
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

          {/* phone number */}
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="phone"
              name="phone"
              id="phone-input"
              placeholder="Puhelinnumero"
              className={
                inputClass +
                (errors.phone && errors.phone.value
                  ? errors.phone.value === "error"
                    ? " border-red-500"
                    : errors.phone.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.phone}
              onBlur={() => errorCheckPhone()}
            />
            {errors.phone && errors.phone.message && (
              <p className={errorClass}>{errors.phone.message}</p>
            )}
          </div>

          {/* Sport */}
          <div className={containerClass}>
            <select
              value={registrationData.sportId || ""}
              name="sportId"
              id="sport-select"
              className={
                inputClass +
                (errors.sportId && errors.sportId.value
                  ? errors.sportId.value === "error"
                    ? " border-red-500"
                    : errors.sportId.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              onChange={handleDropdownChange}
            >
              {registrationData.sportId === null && (
                <option value="">Valitse laji</option>
              )}
              {options.sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
              <option value="new">+ Lisää uusi</option>
            </select>
            {registrationData.sportId === "new" && (
              <input
                type="text"
                name="newSport"
                placeholder="Kirjoita uusi laji MUTTA ÄLÄ LÄHETÄ..."
                value={registrationData.newSport}
                className={inputClass}
                onChange={handleDropdownChange}
              />
            )}
            {errors.sportId && errors.sportId.message && (
              <p className={errorClass}>{errors.sportId.message}</p>
            )}
          </div>

          {/* Group */}
          <div className={containerClass}>
            <select
              className={
                inputClass +
                (errors.groupId && errors.groupId.value
                  ? errors.groupId.value === "error"
                    ? " border-red-500"
                    : errors.groupId.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.groupId || ""}
              name="groupId"
              id="group-select"
              onChange={handleDropdownChange}
            >
              {registrationData.groupId === null && (
                <option value="">Valitse ryhmä</option>
              )}
              {options.student_groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_identifier}
                </option>
              ))}
            </select>
            {errors.groupId && errors.groupId.message && (
              <p className={errorClass}>{errors.groupId.message}</p>
            )}
          </div>

          {/* Campus */}
          <div className={containerClass}>
            <select
              className={
                inputClass +
                (errors.campusId && errors.campusId.value
                  ? errors.campusId.value === "error"
                    ? " border-red-500"
                    : errors.campusId.value === "success"
                      ? " border-green-500"
                      : ""
                  : "")
              }
              value={registrationData.campusId || ""}
              name="campusId"
              id="campus-select"
              onChange={handleDropdownChange}
            >
              {registrationData.campusId === null && (
                <option value="">Valitse toimipaikka</option>
              )}
              {options.campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
            {errors.campusId && errors.campusId.message && (
              <p className={errorClass}>{errors.campusId.message}</p>
            )}
          </div>

          {/* TODO: Button to the center of the 2 cols when in sm:  */}
          <div className="flex sm:col-span-2 w-full justify-center my-8">
            <button
              className=" text-textPrimary border-borderPrimary bg-headerPrimary h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:scale-105 active:scale-95"
              type="submit"
            >
              Rekisteröidy
            </button>
          </div>
        </form>
      </div>
      <div className="absolute right-5 top-5">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default RegistrationPage;
