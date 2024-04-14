import { useState, useEffect } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "./registrationPage.css";
import { getOptions } from "../../services/publicService";

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
        const optionsData = await getOptions();
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
    if (registrationData.password.length < 8 || registrationData.passwordAgain.length < 8) {
      setError("Salasanan tulee olla vähintään 8 merkkiä pitkä");
      setRegistrationData(currentData => ({ ...currentData, password: "", passwordAgain: "" }));
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
      setRegistrationData(currentData => ({ ...currentData, password: "", passwordAgain: "" }));
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

  return (
    <>
      <div className="container">
        <div className="registration-container">
          <div className="registration-header-container">Rekisteröityminen</div>
          <form className="registration-form" onSubmit={registerHandler}>
            <div className="registration-input-container">
              <label htmlFor="email-input">Sähköposti</label>
              <input
                onChange={changeHandler}
                type="text"
                name="email"
                id="email-input"
                placeholder="sähköposti@email.fi"
                value={registrationData.email}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="password-input">Salasana</label>
              <input
                onChange={changeHandler}
                type="password"
                name="password"
                id="password-input"
                placeholder="Salasana"
                value={registrationData.password}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="password-input-2">Salasana uudelleen</label>
              <input
                onChange={changeHandler}
                type="password"
                name="passwordAgain"
                id="password-input-2"
                placeholder="Salasana uudelleen"
                value={registrationData.passwordAgain}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="first-name-input">Etunimi</label>
              <input
                onChange={changeHandler}
                type="text"
                name="firstName"
                id="first-name-input"
                placeholder="Etunimi"
                value={registrationData.firstName}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="last-name-input">Sukunimi</label>
              <input
                onChange={changeHandler}
                type="text"
                name="lastName"
                id="last-name-input"
                placeholder="Sukunimi"
                value={registrationData.lastName}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="phone-select">Puhelinnumero</label>
              <input
                onChange={changeHandler}
                type="phone"
                name="phone"
                id="phone-input"
                placeholder="0401234567"
                value={registrationData.phone}
              />
            </div>
            <div className="registration-input-container">
              <label htmlFor="sport-select">Laji</label>
              <select
                value={registrationData.sportId || ""}
                name="sportId"
                id="sport-select"
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
                  onChange={changeHandler}
                />
              )}
            </div>
            <div className="registration-input-container">
              <label htmlFor="group-select">Ryhmätunnus</label>
              <select
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
            <div className="registration-input-container">
              <label htmlFor="campus-select">Toimipaikka</label>
              <select
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
            <button className="button" type="submit">
              Rekisteröidy
            </button>
          </form>
        </div>
        <div>
          <p>
            Onko sinulla jo tunnukset?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                textDecoration: "underline",
                border: "none",
                background: "none",
                padding: 0,
                color: "blue",
                cursor: "pointer",
              }}
            >
              Kirjaudu sisään
            </button>
          </p>
          {error && <p>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
