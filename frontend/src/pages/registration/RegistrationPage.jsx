import { useState, useEffect } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import publicService from "../../services/publicService";
import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";

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
  const [error, setError] = useState("");

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
    console.log(registrationData);
  }, [registrationData]);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value,
    });
  };

  const errorCheckRegistration = () => {
    if (
      registrationData.email === "" ||
      registrationData.password === "" ||
      registrationData.passwordAgain === "" ||
      registrationData.firstName === "" ||
      registrationData.lastName === "" ||
      registrationData.phone === "" ||
      registrationData.sportId === null ||
      registrationData.groupId === null ||
      registrationData.campusId === null
    ) {
      setError("Täytä kaikki kentät");
      return false;
    }

    // test if password is long enough
    if (
      registrationData.password.length < 8 ||
      registrationData.passwordAgain.length < 8
    ) {
      setError("Salasanan tulee olla vähintään 8 merkkiä pitkä");
      setRegistrationData((currentData) => ({
        ...currentData,
        password: "",
        passwordAgain: "",
      }));
      return false;
    }

    // test if passwords match
    if (registrationData.password !== registrationData.passwordAgain) {
      setError("Salasanat eivät täsmää");
      return false;
    }
    // test if email is in correct format
    const myRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!myRegEx.test(registrationData.email)) {
      setError("Sähköposti ei ole oikeassa muodossa");
      setRegistrationData((currentData) => ({
        ...currentData,
        password: "",
        passwordAgain: "",
      }));
      return false;
    }
    return true;
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    setError("");
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

  const containerClass = "flex flex-col gap-1 ";

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary h-10 w-full r border-b p-1 bg-bgkSecondary focus-visible:outline-none focus-visible:border-graphPrimary";
  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center border-none   h-screen w-screen">
      <div
        className="bg-bgkSecondary border-borderPrimary flex h-full  w-full sm:max-w-[600px]
       flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto"
      >
        <div className="bg-graphPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Rekisteröityminen
        </div>
        <form
          className="p-8 sm:p-12 grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-regGrid w-full"
          onSubmit={registerHandler}
        >
          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="text"
              name="firstName"
              id="first-name-input"
              placeholder="Etunimi"
              value={registrationData.firstName}
              className={inputClass}
            />
          </div>

          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="text"
              name="lastName"
              id="last-name-input"
              placeholder="Sukunimi"
              className={inputClass}
              value={registrationData.lastName}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <input
              onChange={changeHandler}
              type="text"
              name="email"
              id="email-input"
              placeholder="sähköposti"
              className={inputClass}
              value={registrationData.email}
            />
          </div>

          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="password"
              name="password"
              id="password-input"
              placeholder="Salasana"
              className={inputClass}
              value={registrationData.password}
            />
          </div>

          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="password"
              name="passwordAgain"
              id="password-input-2"
              placeholder="Salasana uudelleen"
              className={inputClass}
              value={registrationData.passwordAgain}
            />
          </div>

          <div className={containerClass}>
            <input
              onChange={changeHandler}
              type="phone"
              name="phone"
              id="phone-input"
              placeholder="Puhelinnumero"
              className={inputClass}
              value={registrationData.phone}
            />
          </div>

          <div className={containerClass}>
            <select
              value={registrationData.sportId || ""}
              name="sportId"
              id="sport-select"
              className={inputClass}
              onChange={changeHandler}
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
              />
            )}
          </div>

          <div className={containerClass}>
            <select
              className={inputClass}
              value={registrationData.groupId || ""}
              name="groupId"
              id="group-select"
              onChange={changeHandler}
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
          </div>

          <div className={containerClass}>
            <select
              className={inputClass}
              value={registrationData.campusId || ""}
              name="campusId"
              id="campus-select"
              onChange={changeHandler}
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
          </div>

          {/* TODO: Button to the center of the 2 cols when in sm:  */}
          <div className="flex sm:col-span-2 w-full justify-center my-8">
            <button
              className=" text-textPrimary border-borderPrimary bg-graphPrimary h-12 w-40 cursor-pointer rounded-md border-2 px-4 py-2 duration-75 hover:scale-105 active:scale-95"
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
