import { useState, useEffect } from "react";
import userService from "../../Services/userService";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";
import { getOptions } from "../../Services/publicService";

const RegistrationPage = () => {
  const [userData, setUserData] = useState({
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
    console.log(userData);
  }, [userData]);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const errorCheckRegistration = () => {
    if (
      userData.email === "" ||
      userData.password === "" ||
      userData.passwordAgain === "" ||
      userData.firstName === "" ||
      userData.lastName === "" ||
      userData.phone === "" ||
      userData.sportId === null ||
      userData.groupId === null ||
      userData.campusId === null
    ) {
      setError("Täytä kaikki kentät");
      return false;
    }

    // test if password is long enough
    if (userData.password.length < 8 || userData.passwordAgain.length < 8) {
      setError("Salasanan tulee olla vähintään 8 merkkiä pitkä");
      setUserData(currentData => ({ ...currentData, password: "", passwordAgain: "" }));
      return false;
    }

    // test if passwords match
    if (userData.password !== userData.passwordAgain) {
      setError("Salasanat eivät täsmää");
      return false;
    }
    // test if email is in correct format
    const myRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!myRegEx.test(userData.email)) {
      setError("Sähköposti ei ole oikeassa muodossa");
      setUserData(currentData => ({ ...currentData, password: "", passwordAgain: "" }));
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
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.sportId,
        userData.groupId,
        userData.campusId
      );
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="registrationContainer">
          <div className="registrationHeaderContainer">Rekisteröityminen</div>
          <form className="registrationForm" onSubmit={registerHandler}>
            <div className="registrationInputContainer">
              <label htmlFor="email-input">Sähköposti</label>
              <input
                onChange={changeHandler}
                type="text"
                name="email"
                id="email-input"
                placeholder="sähköposti@email.fi"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="password-input">Salasana</label>
              <input
                onChange={changeHandler}
                type="password"
                name="password"
                id="password-input"
                placeholder="Salasana"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="password-input-2">Salasana uudelleen</label>
              <input
                onChange={changeHandler}
                type="password"
                name="passwordAgain"
                id="password-input-2"
                placeholder="Salasana uudelleen"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="first-name-input">Etunimi</label>
              <input
                onChange={changeHandler}
                type="text"
                name="firstName"
                id="first-name-input"
                placeholder="Etunimi"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="last-name-input">Sukunimi</label>
              <input
                onChange={changeHandler}
                type="text"
                name="lastName"
                id="last-name-input"
                placeholder="Sukunimi"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="phone-select">Puhelinnumero</label>
              <input
                onChange={changeHandler}
                type="phone"
                name="phone"
                id="phone-input"
                placeholder="0401234567"
                value={userData.username}
              />
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="sport-select">Laji</label>
              <select
                value={userData.sportId || ""}
                name="sportId"
                id="sport-select"
                onChange={changeHandler}
              >
                {userData.sportId === null && (
                  <option value="">Valitse laji</option>
                )}
                {options.sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
                <option value="new">+ Lisää uusi</option>
              </select>
              {userData.sportId === "new" && (
                <input
                  type="text"
                  name="newSport"
                  placeholder="Kirjoita uusi laji MUTTA ÄLÄ LÄHETÄ..."
                  value={userData.newSport}
                  onChange={changeHandler}
                />
              )}
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="group-select">Ryhmätunnus</label>
              <select
                value={userData.groupId || ""}
                name="groupId"
                id="group-select"
                onChange={changeHandler}
              >
                {userData.groupId === null && (
                  <option value="">Valitse ryhmä</option>
                )}
                {options.student_groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_identifier}
                  </option>
                ))}
              </select>
            </div>
            <div className="registrationInputContainer">
              <label htmlFor="campus-select">Toimipaikka</label>
              <select
                value={userData.campusId || ""}
                name="campusId"
                id="campus-select"
                onChange={changeHandler}
              >
                {userData.campusId === null && (
                  <option value="">Valitse toimipaikka</option>
                )}
                {options.campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="Button" type="submit">
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
