import { useState, useEffect } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import publicService from "../../services/publicService";
import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

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
  const [errors, setErrors] = useState({
    errorMessage: "",
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
    passwordAgainError: "",
    phoneError: "",
    sportError: "",
    groupError: "",
    campusError: "",
  });

  // reset email errors and check if email is valid
  const checkEmail = () => {
    setErrors({ ...errors, emailError: "" });
    const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (registrationData.email.length < 1) {
      setErrors({ ...errors, emailError: "Sähköposti ei voi olla tyhjä" });
      return false;
    }
    if (!emailRegEx.test(registrationData.email)) {
      setErrors({
        ...errors,
        emailError: "Sähköposti ei ole oikeassa muodossa",
      });
      console.log(errors.emailError);
      return false;
    }
    return true;
  };

  // reset phone errors and check if phone is valid
  const checkPhone = () => {
    setErrors({ ...errors, phoneError: "" });
    const phoneRegEx = /^\d{10,12}$/g;
    if (!phoneRegEx.test(registrationData.phone)) {
      setErrors({
        ...errors,
        phoneError: "Puhelinnumero ei ole oikeassa muodossa",
      });
      return false;
    }
    return true;
  };

  // reset password errors and check if password is valid
  const checkPassword = () => {
    setErrors({ ...errors, passwordError: "", passwordAgainError: "" });

    if (registrationData.password.length < 8) {
      setErrors({
        ...errors,
        passwordError: "Salasana liian lyhyt",
      });
      return false;
    }
    if (registrationData.passwordAgain) {
      if (registrationData.password !== registrationData.passwordAgain) {
        setErrors({
          ...errors,
          passwordAgainError: "Salasanat eivät täsmää",
        });
        return false;
      }
    }

    return true;
  };

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

  // useEffect(() => {
  //   console.log(registrationData);
  // }, [registrationData]);

  useEffect(() => {
    console.log(errors);
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
    let isValid = true;

    // Use functional updates to update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstNameError:
        registrationData.firstName === "" ? "Täytä tämä kenttä" : "",
      lastNameError:
        registrationData.lastName === "" ? "Täytä tämä kenttä" : "",
      emailError: registrationData.email === "" ? "Täytä tämä kenttä" : "",
      passwordError:
        registrationData.password === "" ? "Täytä tämä kenttä" : "",
      passwordAgainError:
        registrationData.passwordAgain === "" ? "Täytä tämä kenttä" : "",
      phoneError: registrationData.phone === "" ? "Täytä tämä kenttä" : "",
      sportError: registrationData.sportId === null ? "Valitse laji" : "",
      groupError: registrationData.groupId === null ? "Valitse ryhmä" : "",
      campusError:
        registrationData.campusId === null ? "Valitse toimipaikka" : "",
    }));

    // Check if any of the fields are empty
    if (
      registrationData.firstName === "" ||
      registrationData.lastName === "" ||
      registrationData.email === "" ||
      registrationData.password === "" ||
      registrationData.passwordAgain === "" ||
      registrationData.phone === "" ||
      registrationData.sportId === null ||
      registrationData.groupId === null ||
      registrationData.campusId === null
    ) {
      isValid = false;
    }

    return isValid;
  };

  const errorCheckRegistration = () => {
    let isValid = true;

    // test if fields are empty
    if (!checkForEmptyFields()) {
      isValid = false;
      return isValid;
    }

    // test passwords
    if (!checkPassword()) {
      isValid = false;
    }

    // test if passwords match
    if (registrationData.password !== registrationData.passwordAgain) {
      setErrors({
        ...errors,
        passwordAgainError: "Salasanat eivät täsmää",
      });
      isValid = false;
    }
    // test if email is in correct format
    if (!checkEmail()) {
      setRegistrationData((currentData) => ({
        ...currentData,
        password: "",
        passwordAgain: "",
      }));
      isValid = false;
    }

    // test if phone number is in correct format
    if (!checkPhone()) {
      isValid = false;
    }
    return isValid;
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    setErrors({ ...errors, errorMessage: "" });
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
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const containerClass = "flex flex-col gap-1 relative";
  const errorClass = "text-red-500 absolute top-full mt-1";

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary h-10 w-full r border-b p-1 pl-0 bg-bgkSecondary focus-visible:outline-none focus-visible:border-headerPrimary";

  // TODO: Fix bug regarding overwriting the error message to instantly green, currently gets first gray then green
  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center border-none   h-screen w-screen">
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
                ` ${errors.firstNameError ? "border-red-500" : ""} `
              }
              onBlur={(e) => {
                if (registrationData.firstName.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else {
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                  setErrors({ ...errors, firstNameError: "" });
                }
              }}
            />
            {errors.firstNameError && (
              <p className={errorClass}>{errors.firstNameError}</p>
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
                inputClass + ` ${errors.lastNameError && "border-red-500"}`
              }
              value={registrationData.lastName}
              onBlur={(e) => {
                if (registrationData.lastName.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else {
                  setErrors({ ...errors, lastNameError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                }
              }}
            />
            {errors.lastNameError && (
              <p className={errorClass}>{errors.lastNameError}</p>
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
                inputClass + ` ${errors.emailError && "border-red-500"}`
              }
              value={registrationData.email}
              onBlur={(e) => {
                if (registrationData.email.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else if (checkEmail()) {
                  setErrors({ ...errors, emailError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                } else {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                }
              }}
            />
            {errors.emailError && (
              <p className={errorClass}>{errors.emailError}</p>
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
                inputClass + ` ${errors.passwordError ? "border-red-500" : ""}`
              }
              value={registrationData.password}
              onBlur={(e) => {
                if (registrationData.password.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else if (registrationData.password.length <= 8) {
                  setErrors({
                    ...errors,
                    passwordError: "Salasana liian lyhyt",
                  });
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else {
                  setErrors({ ...errors, passwordError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                }
              }}
            />
            {errors.passwordError && (
              <p className={errorClass}>{errors.passwordError}</p>
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
                inputClass + ` ${errors.passwordAgainError && "border-red-500"}`
              }
              value={registrationData.passwordAgain}
              onBlur={(e) => {
                if (registrationData.passwordAgain.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else if (checkPassword()) {
                  setErrors({ ...errors, passwordAgainError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                } else {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                }
              }}
            />
            {errors.passwordAgainError && (
              <p className={errorClass}>{errors.passwordAgainError}</p>
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
                inputClass + ` ${errors.phoneError && "border-red-500"}`
              }
              value={registrationData.phone}
              onBlur={(e) => {
                if (registrationData.phone.length < 1) {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                } else if (checkPhone()) {
                  setErrors({ ...errors, phoneError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                } else {
                  e.target.classList.remove("border-green-500");
                  e.target.classList.add("border-red-500");
                }
              }}
            />
            {errors.phoneError && (
              <p className={errorClass}>{errors.phoneError}</p>
            )}
          </div>

          {/* Sport */}
          <div className={containerClass}>
            <select
              value={registrationData.sportId || ""}
              name="sportId"
              id="sport-select"
              className={
                inputClass + ` ${errors.sportError && "border-red-500"}`
              }
              onChange={changeHandler}
              onBlur={(e) => {
                if (registrationData.sportId !== null) {
                  setErrors({ ...errors, sportError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                }
              }}
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
                onChange={changeHandler}
                onBlur={(e) => {
                  if (registrationData.newSport === "") {
                    setErrors({
                      ...errors,
                      sportError: "Lisää uusi laji",
                    });
                  } else {
                    setErrors({ ...errors, sportError: "" });
                    e.target.classList.remove("border-red-500");
                    e.target.classList.add("border-green-500");
                  }
                }}
              />
            )}
            {errors.sportError && (
              <p className={errorClass}>{errors.sportError}</p>
            )}
          </div>

          {/* Group */}
          <div className={containerClass}>
            <select
              className={
                inputClass + ` ${errors.groupError && "border-red-500"}`
              }
              value={registrationData.groupId || ""}
              name="groupId"
              id="group-select"
              onChange={changeHandler}
              onBlur={(e) => {
                if (registrationData.groupId !== null) {
                  setErrors({ ...errors, groupError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                }
              }}
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
            {errors.groupError && (
              <p className={errorClass}>{errors.groupError}</p>
            )}
          </div>

          {/* Campus */}
          <div className={containerClass}>
            <select
              className={
                inputClass + ` ${errors.campusError && "border-red-500"}`
              }
              value={registrationData.campusId || ""}
              name="campusId"
              id="campus-select"
              onChange={changeHandler}
              onBlur={(e) => {
                if (registrationData.campusId !== null) {
                  setErrors({ ...errors, campusError: "" });
                  e.target.classList.remove("border-red-500");
                  e.target.classList.add("border-green-500");
                }
              }}
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
            {errors.campusError && (
              <p className={errorClass}>{errors.campusError}</p>
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
