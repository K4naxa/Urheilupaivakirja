import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/confirmModal";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../hooks/toast-messages/useToast";

import cc from "../../utils/cc";
import trainingService from "../../services/trainingService";

function TeacherProfilePage() {
  const { logout } = useAuth();
  const { addToast } = useToast();

  // statet Modalia varten
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [continueButton, setContinueButton] = useState("");
  const [agreeStyle, setAgreeStyle] = useState("");
  const [handleUserConfirmation, setHandleUserConfirmation] = useState(
    () => {}
  );

  const [
    updatedCourseComplitionRequirement,
    setUpdatedCourseComplitionRequirement,
  ] = useState(0);

  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [
    courseComplitionRequirementError,
    setCourseComplitionRequirementError,
  ] = useState("");

  const { data: visitorData, isLoading: visitorDataLoading } = useQuery({
    queryKey: ["visitorData"],
    queryFn: () => userService.getProfileData(),
    staleTime: 15 * 60 * 1000,
  });

  const { data: courseComplitionRequirement } = useQuery({
    queryKey: ["courseComplitionRequirement"],
    queryFn: () => trainingService.getCourseSegments(),
    staleTime: 15 * 60 * 1000,
  });

  const validateEmail = (email) => {
    const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (email.length === 0) {
      setEmailError("Sähköpostiosoite ei voi olla tyhjä");
      return false;
    }
    if (email === visitorData.email) {
      setEmailError("Sähköpostiosoite on jo käytössä");
      return false;
    }

    if (!email.match(emailRegEx)) {
      setEmailError("Sähköpostiosoite ei ole kelvollinen");
      return false;
    }
    return true;
  };
  const handleEmailUpdate = async () => {
    try {
      //  TODO: LISÄÄ TÄNNE EMAIL MUUTOSEN KÄSITTELY

      addToast("Sähköposti päivitetty", { style: "success" });
    } catch (error) {
      addToast("Virhe päivitettäessä sähköpostia", { style: "error" });
    }
  };

  const validateNewPasswords = () => {
    let passwordError = "";
    let newPasswordError = "";
    if (currentPassword.length === 0) {
      passwordError = "Nykyinen salasana ei voi olla tyhjä";
    } else {
      setPasswordError("");
    }
    if (newPassword !== confirmPassword) {
      newPasswordError = "Salasanat eivät täsmää";
    } else {
      setNewPasswordError("");
    }
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      newPasswordError = "Salasanat eivät voi olla tyhjiä";
    }

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      newPasswordError = "Salasanan pituuden oltava vähintään 8 merkkiä";
    }

    if (passwordError.length > 0 || newPasswordError.length > 0) {
      setPasswordError(passwordError);
      setNewPasswordError(newPasswordError);
      return false;
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // TODO: LISÄÄ TÄNNE SALASANAN VAIHTO KÄSITTELY

      addToast("Salasana päivitetty", { style: "success" });
    } catch (error) {
      addToast("Virhe päivitettäessä salasanaa", { style: "error" });
    }
  };

  const validateCourseComplitionRequirement = () => {
    if (updatedCourseComplitionRequirement.length === 0) {
      setCourseComplitionRequirementError(
        "Merkintöjen määrä ei voi olla tyhjä"
      );
      return false;
    }
    if (updatedCourseComplitionRequirement < 1) {
      setCourseComplitionRequirementError(
        "Merkintöjen määrän oltava vähintään 1"
      );
      return false;
    }
    if (
      updatedCourseComplitionRequirement ===
      courseComplitionRequirement[0].value
    ) {
      setCourseComplitionRequirementError(
        "Merkintöjen määrä on jo asetettu tähän arvoon"
      );
      return false;
    }
    return true;
  };

  const handleCourseComplitionRequirementUpdate = async () => {
    setShowConfirmModal(true);
    setAgreeStyle("");
    setModalMessage(
      `Haluatko varmasti päivittää merkintöjen määrä vaatimuksen arvoon ${updatedCourseComplitionRequirement}?`
    );
    setContinueButton("Päivitä");
    const handleUpdate = async () => {
      try {
        trainingService.updateCourseSegments(
          updatedCourseComplitionRequirement
        );

        addToast("Merkintöjen määrä vaatimus päivitetty", { style: "success" });
        setShowConfirmModal(false);
      } catch (error) {
        addToast("Virhe päivitettäessä merkintöjen määrä vaatimusta", {
          style: "error",
        });
      }
    };
    setHandleUserConfirmation(() => handleUpdate);
  };

  const handleAccountDelete = () => {
    setShowConfirmModal(true);
    setAgreeStyle("red");
    setModalMessage(
      `Haluatko varmasti poistaa käyttäjän ${visitorData.first_name} ${visitorData.last_name}? 
  
      Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`
    );
    setContinueButton("Poista");

    const handleUserConfirmation = async () => {
      try {
        await userService.deleteUser(visitorData.id);
        await logout();
        addToast("Käyttäjä poistettu", { style: "success" });
      } catch (error) {
        console.error("Error deleting user or logging out:", error);
      } finally {
        setShowConfirmModal(false);
      }
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
  };

  useEffect(() => {
    if (visitorData) {
      setUpdatedEmail(visitorData.email);
    }
  }, [visitorData]);
  useEffect(() => {
    if (courseComplitionRequirement) {
      setUpdatedCourseComplitionRequirement(
        courseComplitionRequirement[0].value
      );
    }
  }, [courseComplitionRequirement]);

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary border rounded-md p-1 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  if (visitorDataLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen />
      </div>
    );
  } else
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col w-full gap-8 p-4 divide-y rounded-md md:max-w-4xl">
          {/* Kurssin tiedot container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-primaryColor">
            <div>
              <h1 className="text-xl">Kurssin tiedot</h1>
              <small className="text-textSecondary">
                Tarkistele tai päivitä kurssin tietoja
              </small>
            </div>

            <form className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="name">
                Merkintöjen määrä vaatimus
              </label>
              <small className="text-textSecondary">
                Kuinka monta merkintää vaaditaan opiskelijalta, jotta kurssi
                näytetään suoritetuksi
              </small>
              <input
                type="number"
                name="name"
                value={updatedCourseComplitionRequirement}
                onChange={(e) => {
                  setUpdatedCourseComplitionRequirement(e.target.value);
                }}
                className={cc(inputClass, "disabled:text-opacity-70")}
              />
              <small className="text-red-500">
                {courseComplitionRequirementError}
              </small>
              <button
                className="p-2 mt-4 text-white w-fit Button"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateCourseComplitionRequirement()) {
                    setCourseComplitionRequirementError("");
                    handleCourseComplitionRequirementUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </form>
          </div>

          {/* Profiilin tiedot container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Profiilin tiedot</h1>
              <small className="text-textSecondary">
                Tarkistele tai päivitä käyttäjäsi tietoja
              </small>
            </div>

            <form className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="name">
                Nimi
              </label>
              <input
                type="text"
                name="name"
                disabled
                value={visitorData.first_name + " " + visitorData.last_name}
                className={cc(
                  inputClass,
                  "cursor-not-allowed",
                  "disabled:text-opacity-70"
                )}
              />
            </form>

            <form className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="email">
                Sähköposti
              </label>
              <input
                type="email"
                name="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
              <small className="text-red-500">{emailError}</small>
              <button
                className="p-2 mt-4 text-white w-fit Button"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateEmail(updatedEmail)) {
                    setEmailError("");
                    handleEmailUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </form>
          </div>

          {/* Päivitä salasana container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Päivitä salasana</h1>
              <small className="text-textSecondary">
                Muista käyttää pitkää ja turvallista salasanaa
              </small>
            </div>

            <form action="#" className="flex flex-col gap-4">
              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="currentPassword">
                  Nykyinen salasana
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={cc(inputClass, "disabled:text-opacity-80")}
                />
                <small className="text-red-500">{passwordError}</small>
              </div>

              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="newPassword">
                  Uusi salasana
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cc(inputClass, "disabled:text-opacity-80")}
                />
                <small className="text-red-500">{newPasswordError}</small>
              </div>

              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="confirmPassword">
                  Vahvista salasana
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  name="newPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cc(inputClass, "disabled:text-opacity-80")}
                />
                <small className="text-red-500">{newPasswordError}</small>
              </div>
              <button
                className="p-2 text-white w-fit Button"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateNewPasswords()) {
                    setPasswordError("");
                    handlePasswordUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </form>
          </div>

          {/* Käyttäjän postamisen container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div className="flex flex-col max-w-xl">
              {" "}
              <h1 className="text-xl ">Poista käyttäjä</h1>
              <small className="text-textSecondary">
                Kun käyttäjä on poistettu, kaikki käyttäjän tiedot poistetaan
                pysyvästi. Tämä toiminto on peruuttamaton
              </small>
            </div>
            <button
              className="w-32 text-white Button bg-iconRed"
              onClick={() => {
                handleAccountDelete();
              }}
            >
              Poista Käyttäjä
            </button>
          </div>
        </div>
        <ConfirmModal
          isOpen={showConfirmModal}
          onDecline={() => setShowConfirmModal(false)}
          onAgree={handleUserConfirmation}
          text={modalMessage}
          agreeButton={continueButton}
          declineButton={"Peruuta"}
          agreeStyle={agreeStyle}
        />
      </div>
    );
}

export default TeacherProfilePage;
